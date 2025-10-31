from datetime import datetime, timedelta, timezone
import time
import os
from zoneinfo import ZoneInfo
import sqlite3

from pathlib import Path



from .Accounts import Accounts
from .Validations import UserRentals
from .Validations import AdminValidations

db_path = "db/sqlite.db"


class InitializeTables:

    @staticmethod
    def SqliteFile_Exists():
        return Path(db_path).is_file()


    @staticmethod
    def create_sqlite_file():
        if not InitializeTables.SqliteFile_Exists():
            open(db_path, 'a').close()
            print("Created sqlite file at db/sqlite.db")


    @staticmethod
    def create_tables():
        """
        Create necessary tables if not exist
        """
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()

                #  accounts table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS accounts (
                        ID INTEGER PRIMARY KEY,
                        NAME TEXT NOT NULL UNIQUE,
                        HASHED_PASSWORD TEXT NOT NULL,
                        EMAIL TEXT UNIQUE,
                        session_cookie TEXT,
                        first_name TEXT,
                        last_name TEXT,
                        birthday DATE,
                        contact TEXT,
                        created_on datetime
                    );
                """)

                cursor.execute("""
                INSERT OR IGNORE INTO accounts (NAME, HASHED_PASSWORD, session_cookie)
                VALUES ( 'admin', '$2b$12$XIwrTKqWHl6tSum5T2yjxu3Ce8Pynvc9Ie9ejblahDSwryfTXcepW', '0f32c0fe13ad509e1a2fadbe72d5ad8f7fae769c332d0e34c9ef0fba0cebacb9' );
                """)

                #  game_catalog table
                cursor.execute("""
                CREATE TABLE IF NOT EXISTS game_catalog (
                    ID INTEGER PRIMARY KEY,
                    game_name TEXT,
                    platform TEXT,
                    price_to_rent REAL,
                    total_stocks INT,
                    cover_image_path TEXT,
                    date_added datetime,
                    currently_rented INT
                    );
                """)

                #  transactions table
                cursor.execute("""
                CREATE TABLE IF NOT EXISTS transactions (
                ID INTEGER PRIMARY KEY,
                user_id INTEGER,
                user_name TEXT,
                game_id INTEGER,
                game_name TEXT,
                rented_on DATETIME default CURRENT_TIMESTAMP,
                quantity INTEGER,
                total_price REAL,
                status TEXT,
                return_on DATETIME,
                game_console TEXT
                );
                """)


                #  rentals table
                cursor.execute("""
                CREATE TABLE IF NOT EXISTS rentals (
                ID INTEGER PRIMARY KEY,
                user_id INTEGER,
                user_name TEXT,
                game_id INTEGER,
                game_name TEXT,
                rented_on DATETIME DEFAULT CURRENT_TIMESTAMP,
                quantity INTEGER,
                total_price REAL,
                status TEXT,
                return_on DATETIME,
                transaction_id INTEGER
                );
                """)

                #  forget_password table
                cursor.execute("""
                CREATE TABLE IF NOT EXISTS forget_password (
                ID INTEGER PRIMARY KEY,
                email TEXT,
                reset_code TEXT,
                session_value TEXT,
                expiration INTEGER
                );
                """)

                conn.commit()
        except sqlite3.Error as err:
            print(err)



class SqlAccounts:

    @staticmethod
    def checkString_Iftaken(Column: str, toCheck: str) -> bool:
        """i dont know"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(f"SELECT EXISTS(SELECT 1 FROM accounts WHERE UPPER( {Column} ) = UPPER( ? ) )", (toCheck,))

                return bool( cursor.fetchone()[0] )

        except sqlite3.Error as err:
            print(f"{Column} err: {err}")
            return True


    @staticmethod
    def login(username: str, plain_password: str) -> bool:
        """Check username + password. Returns True if valid, else False."""

        conn = None
        try:
            conn =  sqlite3.connect(db_path)

            cursor = conn.cursor()
            cursor.execute("SELECT HASHED_PASSWORD FROM accounts WHERE NAME = ?", (username,))
            row = cursor.fetchone()

            print("Fetched from DB: ", row)
            if row is None:
                return False

            stored_hash = row[0]
            return Accounts.check_hashpw(plain_password, stored_hash)
        except sqlite3.Error as err:
            print(err)
            return False
        finally:
            if conn is not None:
                conn.close()

    @staticmethod
    def store_session(session_token: str, username: str) -> bool:
        """Store session token in DB"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    UPDATE accounts
                    set session_cookie = ?
                    WHERE NAME = ?
                    """, (session_token, username))
                conn.commit()
                print(f"Stored session token for user {username}")
            return True
        except sqlite3.Error as err:
            print("Failed to store session token:", err)
            return False


    @staticmethod
    def get_username_from_session(session_token: str) -> list | None:
        """Get username from session token"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT ID, NAME, status FROM accounts WHERE session_cookie = ?", (session_token,))
                row = cursor.fetchone()
                if row is None:
                    return None
                return [ row[0], row[1], row[2] ]
        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def register(request: Accounts.RegisterRequest) -> bool:
        """Register validation"""
        hashpw_pw = Accounts.hash_password(request.password)

        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO accounts(NAME, HASHED_PASSWORD, EMAIL, first_name, last_name, birthday, contact, created_on)
                    VALUES( ?, ?, ?, ?, ?, ?, ?, ? )
                    """, (request.username.strip(),
                          hashpw_pw,
                          request.email.strip(),
                          request.firstname.strip(),
                          request.lastname.strip(),
                          request.birthday,
                          request.contact.strip(),
                          datetime.now(ZoneInfo("Asia/Manila"))
                          ))
                conn.commit()
            return True
        except sqlite3.Error:
            return False


    @staticmethod
    def store_reset_password(email: str, code: str, session_value: str):
        expiration_timer = int( time.time() ) + ( 5 * 60 )
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                INSERT INTO forget_password(email, reset_code, session_value, expiration)
                VALUES(?, ?, ? ,?)
                """,(email, code, session_value, expiration_timer))
        except sqlite3.Error as err:
            print(err)



    @staticmethod
    def verify_reset_password(code: str, email: str, credentials: str) -> bool:
        current_time = time.time()
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT 1 FROM forget_password
                WHERE 
                ( email = ? AND reset_code = ? AND session_value = ?)
                AND expiration > ?
                """,(email, code, credentials, current_time))

                row = cursor.fetchone()

                if row is None:
                    return False

                return True

        except sqlite3.Error as err:
            print(err)
            return False

    @staticmethod
    def increase_timer_forgetpass(code: str, email: str, credentials: str):
        current_time = time.time()
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE forget_password
                SET expiration = ?
                WHERE 
                ( email = ? AND reset_code = ? AND session_value = ?)
                """,(current_time + 5 * 60,email, code, credentials))
                conn.commit()
        except sqlite3.Error as err:
            print(err)

    @staticmethod
    def change_password(email: str, new_password: str) -> bool:
        hashed_newpass = Accounts.hash_password(new_password)
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE accounts
                SET HASHED_PASSWORD = ?
                WHERE EMAIL = ?
                """, (hashed_newpass, email))
                conn.commit()
                return True
        except sqlite3.Error as err:
            print(err)
            return False

    @staticmethod
    def cleanup_forgetpass_session(email: str):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                DELETE FROM forget_password
                WHERE email = ?
                """, (email,))
                conn.commit()
                return True
        except sqlite3.Error as err:
            print(err)
            return False
    



class SqlAdmin:

    @staticmethod
    def view_rental_detail(id: int):
        manila_time = ZoneInfo("Asia/Manila")
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT ID, user_name, game_name, rented_on, return_on, total_price, status, quantity, game_console FROM transactions
                WHERE ID = ?
                """,(id,))
                row = cursor.fetchone()

                isOverdue = datetime.fromisoformat(row[4]) < datetime.now(manila_time)
                row = {
                    "id" : row[0],
                    "name" : row[1],
                    "title" : row[2],
                    "rented_on" : row[3],
                    "return_on" : row[4],
                    "price" : row[5],
                    "status" : row[6],
                    "quantity" : row[7],
                    "console" : row[8],
                    "isOverdue" : isOverdue
                }
                return row

        except sqlite3.Error as err:
            print(err)
            return None



    @staticmethod
    def view_rentals(page: int, status_filter: str = "", searchbyname: str = "", searchbygame: str = "", searchbydate: str = ""):
        """Mark overdue rentals using SQL, then return computed overdue totals (not saved)."""
        manila_time = ZoneInfo("Asia/Manila")
        now_ph = datetime.now(manila_time).replace(tzinfo=None)

        try:
            with sqlite3.connect(db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()

                # Update overdue statuses only (optional)
                cursor.execute("""
                    UPDATE rentals
                    SET status = 'Overdue'
                    WHERE status = 'Ongoing' AND return_on < ?
                """, (now_ph.isoformat(),))
                conn.commit()

                status_filter_format = f"%{status_filter}%"
                searchbyname_format = f"%{searchbyname}%"
                searchbygame_format = f"%{searchbygame}%"
                searchbydate_format = f"%{searchbydate}%"
                offset = (page - 1) * 10

                cursor.execute("""
                    SELECT ID, user_name, game_name, rented_on, return_on, total_price, status,
                        transaction_id, game_id
                    FROM rentals
                    WHERE status LIKE ? COLLATE NOCASE
                    AND ( user_name LIKE ? COLLATE NOCASE AND game_name LIKE ? COLLATE NOCASE )
                    AND ( rented_on LIKE ? COLLATE NOCASE )
                    ORDER BY ID DESC
                    LIMIT 10 OFFSET ?
                """, (status_filter_format, searchbyname_format,
                    searchbygame_format, searchbydate_format, offset))
                rows = cursor.fetchall()

                result = []
                for r in rows:
                    return_on = datetime.fromisoformat(r["return_on"]).replace(tzinfo=None)
                    days_overdue = max(0, (now_ph.date() - return_on.date()).days)
                    display_price = (
                        r["total_price"] * (2 ** days_overdue)
                        if r["status"] == "Overdue"
                        else r["total_price"]
                    )

                    result.append({
                        "id": r["ID"],
                        "name": r["user_name"],
                        "title": r["game_name"],
                        "rented_on": r["rented_on"],
                        "return_on": r["return_on"],
                        "price": display_price,
                        "status": r["status"],
                        "transaction_id": r["transaction_id"],
                        "game_id": r["game_id"],
                        "days_overdue": days_overdue,
                    })

                return result

        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def confirm_return(id: int, total_price: int):

        manila_time = ZoneInfo("Asia/Manila")
        now_ph = datetime.now(manila_time).isoformat()
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()

                cursor.execute("""
                    SELECT game_id, quantity
                    FROM rentals
                    WHERE ID = ? AND status != 'Returned'
                """, (id,))
                rental = cursor.fetchone()

                if not rental:
                    print(f"No active rental found for ID {id}")
                    return

                game_id, quantity = rental

                cursor.execute("""
                    UPDATE rentals
                    SET 
                        status = 'Returned',
                        returned_on = ?,
                        total_price = ?
                    WHERE ID = ?
                """, (now_ph, total_price, id ))

                cursor.execute("""
                    UPDATE game_catalog
                    SET currently_rented = CASE
                        WHEN currently_rented - ? < 0 THEN 0
                        ELSE currently_rented - ?
                    END
                    WHERE ID = ?
                """, (quantity, quantity, game_id))

                conn.commit()

        except sqlite3.Error as err:
            print(err)


    @staticmethod
    def deny_transaction(id: int):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE transactions
                SET status = 'Denied'
                WHERE ID = ?
                """, (id,))
                conn.commit()
        except sqlite3.Error as err:
            print(err)


    @staticmethod
    def approve_transaction(id: int):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE transactions
                SET status = 'Approved'
                WHERE ID = ?
                """, (id,))
                conn.commit()
        except sqlite3.Error as err:
            print(err)


    @staticmethod
    def insertinto_rentals(id: int):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()

                cursor.execute("""
                    INSERT INTO rentals (
                        user_id,
                        user_name,
                        game_id,
                        game_name,
                        rented_on,
                        quantity,
                        total_price,
                        status,
                        return_on,
                        transaction_id
                    )
                    SELECT
                        user_id,
                        user_name,
                        game_id,
                        game_name,
                        rented_on,
                        quantity,
                        total_price,
                        'Ongoing',
                        return_on,
                        ID
                    FROM transactions
                    WHERE ID = ?
                """, (id,))

                cursor.execute("""
                    UPDATE game_catalog
                    SET currently_rented = 
                        COALESCE(currently_rented, 0) + (
                            SELECT quantity FROM transactions WHERE ID = ?
                        )
                    WHERE ID = (
                        SELECT game_id FROM transactions WHERE ID = ?
                    )
                """, (id, id))

                cursor.execute("""
                    SELECT total_stocks, COALESCE(currently_rented, 0)
                    FROM game_catalog
                    WHERE ID = (
                        SELECT game_id FROM transactions WHERE ID = ?
                    )
                """, (id,))
                total_stocks, currently_rented = cursor.fetchone()
                remaining_stock = total_stocks - currently_rented

                if remaining_stock <= 0:
                    cursor.execute("""
                        UPDATE transactions
                        SET status = 'Denied'
                        WHERE game_id = (
                            SELECT game_id FROM transactions WHERE ID = ?
                        )
                        AND status = 'Pending'
                        AND ID != ?
                    """, (id, id))
                else:
                    cursor.execute("""
                        UPDATE transactions
                        SET status = 'Denied'
                        WHERE game_id = (
                            SELECT game_id FROM transactions WHERE ID = ?
                        )
                        AND status = 'Pending'
                        AND quantity > ?
                        AND ID != ?
                    """, (id, remaining_stock, id))

                conn.commit()

        except sqlite3.Error as err:
            print(err)


    @staticmethod
    def view_transactions(page: int, status_filter: str = "", searchbyname: str = "", searchbygame: str = "", searchbydate: str = ""):
        """view transactions for admin dashboard transactions page"""

        SqlAdmin.expire_pending_transactions()

        manila_time = ZoneInfo("Asia/Manila")
        now_ph = datetime.now(manila_time).isoformat()

        status_filter_format = f"%{status_filter}%"
        searchbyname_format = f"%{searchbyname}%"
        searchbygame_format = f"%{searchbygame}%"
        searchbydate_format = f"%{searchbydate}%"
        offset = (page - 1) * 10
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()

                cursor.execute("""
                    UPDATE transactions
                    SET status = 'Denied'
                    WHERE status = 'Pending' AND return_on < ?
                """, (now_ph,))
                conn.commit()

                cursor.execute("""
                    SELECT ID, user_name, game_name, rented_on, return_on,
                               total_price, status, quantity, game_console,
                                ( SELECT SUM(total_price)
                                FROM transactions
                                WHERE status LIKE ? COLLATE NOCASE
                                ) AS total_transactions
                    FROM transactions
                    WHERE status LIKE ? COLLATE NOCASE
                    AND ( user_name LIKE ? COLLATE NOCASE AND game_name LIKE ? COLLATE NOCASE )
                    AND ( rented_on LIKE ? COLLATE NOCASE )
                    ORDER BY ID DESC
                    LIMIT 10 OFFSET ?
                """, (status_filter_format, status_filter_format, searchbyname_format, searchbygame_format, searchbydate_format, offset ))
                rows = cursor.fetchall()
            return [
                {
                    "id": r[0],
                    "name": r[1],
                    "title": r[2],
                    "rented_on": r[3],
                    "return_on": r[4],
                    "price": r[5],
                    "status": r[6],
                    "quantity": r[7],
                    "console": r[8],
                    "total_transactions": r[9],
                }
                for r in rows
            ]
        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def expire_pending_transactions():
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE transactions
                SET status = 'Denied'
                WHERE status = 'Pending' AND expires_at < ?
                """, (datetime.now(timezone.utc).timestamp(),))
                conn.commit()
        except sqlite3.Error as err:
            print(err)





    @staticmethod
    def view_game_detail(id: int):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT * FROM game_catalog
                WHERE ID = ?
                """, (id,))
                row = cursor.fetchone()
                if row is None:
                    return None
                row = {
                    "id": row[0],
                    "game_name": row[1],
                    "platform": row[2],
                    "price_to_rent": row[3],
                    "total_stocks": row[4],
                    "cover_image_path": row[5],
                    "date_added": row[6],
                    "currently_rented": row[7],
                    "description": row[8],
                }
                return row
        except sqlite3.Error as err:
            print(err)
            return None



    @staticmethod
    def view_games(page: int, searchbygame: str = "", searchbydate: str = "", filterby: str = ""):
        """View game titles for admin dashboard stock page with filters and pagination"""
        try:
            offset = (page - 1) * 10
            searchbygame_format = f"%{searchbygame}%"
            searchbydate_format = f"%{searchbydate}%"

            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()

                cursor.execute("""
                    SELECT
                        ID,
                        game_name,
                        date_added,
                        platform,
                        total_stocks,
                        currently_rented,
                        platform
                    FROM game_catalog
                    WHERE game_name LIKE ? COLLATE NOCASE
                    AND date_added LIKE ? COLLATE NOCASE
                    ORDER BY ID DESC
                    LIMIT 10 OFFSET ?
                """, (searchbygame_format, searchbydate_format, offset))

                rows = cursor.fetchall()

                gametitles = []
                for row in rows:
                    game_id, name, date_added, console, total, rented, console = row
                    remaining = max(total - rented, 0)
                    status = "Available" if remaining > 0 else "Out of Stock"

                    if filterby and filterby != status:
                        continue

                    gametitles.append({
                        "id": game_id,
                        "Title": name,
                        "Date_Added": date_added,
                        "Console": console,
                        "Quantity": f"{remaining}/{total}",
                        "status": status,
                        "console": console
                    })

                return gametitles

        except sqlite3.Error as err:
            print("Database error:", err)
            return None


    @staticmethod
    def low_stock_games():
        """Return all games that are low (≤30%) or out of stock."""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT
                        ID,
                        game_name,
                        platform,
                        total_stocks,
                        currently_rented
                    FROM game_catalog
                    WHERE
                        (total_stocks - COALESCE(currently_rented, 0)) <= (0.5 * total_stocks)
                        OR (total_stocks - COALESCE(currently_rented, 0)) <= 0
                    ORDER BY ID DESC
                """)

                rows = cursor.fetchall()

                gametitles = []
                for row in rows:
                    game_id, name, console, total, rented = row
                    remaining = max(total - (rented or 0), 0)
                    ratio = remaining / total if total > 0 else 0

                    if remaining == 0:
                        status = "Out of Stock"
                    elif ratio <= 0.5:
                        status = "Low Stock"
                    else:
                        continue

                    gametitles.append({
                        "id": game_id,
                        "title": name,
                        "Console": console,
                        "Quantity": f"{remaining}/{total}",
                        "status": status,
                    })

                return gametitles

        except sqlite3.Error as err:
            print("Database error:", err)
            return None



    @staticmethod
    def delete_rental(id: int):
        """Admin delete rental record from table transactions"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                DELETE FROM rentals
                WHERE ID = ?
                """,(id, ))
            conn.commit()
        except sqlite3.Error as err:
            print(err)

    @staticmethod
    def delete_transaction(id: int):
        """Admin delete transaction record from table transactions"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                DELETE FROM transactions
                WHERE ID = ?
                """,(id, ))
            conn.commit()
        except sqlite3.Error as err:
            print(err)



    @staticmethod
    def get_gamecd_cover(game_id: int):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT cover_image_path FROM game_catalog
                WHERE ID = ?
                """, (game_id,))
                row = cursor.fetchone()
                if row is None:
                    return None
                return row[0]
        except sqlite3.Error as err:
            print(err)
            return None

    @staticmethod
    def add_game(game_info: AdminValidations.add_games_model, cover_image_path: str) -> bool:
        """Admin Add Game"""
        print("add game")

        manila_time = ZoneInfo("Asia/Manila")
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO game_catalog (game_name, platform, price_to_rent, total_stocks, cover_image_path, date_added, currently_rented, description)
                    VALUES ( ?, ?, ?, ?, ?, ?, 0, ?)
                               """, 
                    (game_info.game_name, game_info.platform, game_info.price, game_info.quantity, cover_image_path, datetime.now(manila_time), game_info.description)
                                     )

                conn.commit()
                return True
        except sqlite3.Error as err:
            print(err)
            return False

    @staticmethod
    def update_game_no_image(
        game_id: int,
        request: AdminValidations.add_games_model,
    ):

        # old_image_path = SqlAdmin.get_gamecd_cover(game_id)
        # old_name = old_image_path 
        #
        # if old_name != request.game_name and old_image_path and os.path.exists(old_image_path):
        #     ext = os.path.splitext(old_image_path)[1]
        #     new_image_path = f"images/gamecover/{request.game_name}{ext}"
        #     os.rename(old_image_path, new_image_path)
        #     print(f"Renamed image to {new_image_path}")

        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE game_catalog
                SET game_name = ?,
                    platform = ?,
                    price_to_rent = ?,
                    total_stocks = ?,
                    description = ?
                WHERE ID = ?
                """,(
                    request.game_name,
                    request.platform,
                    request.price,
                    request.quantity,
                    request.description,
                    game_id
                               ))
                conn.commit()
                print(f"Updated game_catalog ID {game_id}")
        except sqlite3.Error as err:
            print(err)

    @staticmethod
    def update_game_w_image(
        game_id: int,
        request: AdminValidations.add_games_model,
        cover_image_path: str
    ):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE game_catalog
                SET game_name = ?,
                    platform = ?,
                    price_to_rent = ?,
                    total_stocks = ?,
                    description = ?,
                    cover_image_path = ?
                WHERE ID = ?
                """,(
                    request.game_name,
                    request.platform,
                    request.price,
                    request.quantity,
                    request.description,
                    cover_image_path,
                    game_id
                               ))
                conn.commit()
                print(f"Updated game_catalog ID {game_id}")
        except sqlite3.Error as err:
            print(err)


    @staticmethod
    def check_if_can_delete_game(game_id: int) -> bool:
        """Check if game can be deleted (no ongoing rentals)"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT 1 FROM game_catalog
                WHERE ID = ? 
                AND ( currently_rented = 0 OR currently_rented IS NULL )
                """,(game_id, ))

                row = cursor.fetchone()

                if row is None:
                    return False

                return True

        except sqlite3.Error as err:
            print(err)
            return False


    @staticmethod
    def delete_game(id: int) -> bool:
        """Admin delete game from table game_catalog"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                DELETE FROM game_catalog
                WHERE ID = ?
                """,(id, ))

                cursor.execute("""
                UPDATE transactions
                SET status = 'Denied'
                WHERE game_id = ?
                """,(id, ))

            conn.commit()
            return True
        except sqlite3.Error as err:
            print(err)
            return False


    @staticmethod
    def view_customers(
        page: int,
        searchbyname: str = "",
        searchbyemail: str = "",
        searchbycontact: str = "",
        searchbystatus: str = "",
    ):
        """View customers for admin dashboard customers page with filters and pagination"""
        try:
            offset = (page - 1) * 10
            searchbyname_format = f"%{searchbyname}%"
            searchbyemail_format = f"%{searchbyemail}%"
            searchbycontact_format = f"%{searchbycontact}%"
            searchbystatus_format = f"%{searchbystatus}%"

            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT ID, NAME, EMAIL, first_name, last_name, birthday, contact, status
                    FROM accounts
                    WHERE ( NAME LIKE ? COLLATE NOCASE )
                    AND ( EMAIL LIKE ? COLLATE NOCASE )
                    AND ( CONTACT LIKE ? COLLATE NOCASE )
                    AND ( status LIKE ? COLLATE NOCASE )
                    AND ( NAME != 'admin' )
                    ORDER BY ID DESC
                    LIMIT 10 OFFSET ?
                """, (
                    searchbyname_format,
                    searchbyemail_format,
                    searchbycontact_format,
                    searchbystatus_format,
                    offset
                ))

                rows = cursor.fetchall()

                customers = []
                for row in rows:
                    customers.append({
                        "id": row[0],
                        "username": row[1],
                        "email": row[2],
                        "first_name": row[3],
                        "last_name": row[4],
                        "birthday": row[5],
                        "contact": row[6],
                        "status": row[7],
                    })

                return customers

        except sqlite3.Error as err:
            print("Database error:", err)
            return None


    @staticmethod
    def view_customer_info(id: int):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT ID, NAME, EMAIL, first_name, last_name, birthday, contact, created_on FROM accounts
                WHERE ID = ?
                """, (id,))
                row = cursor.fetchone()
                if row is None:
                    return None
                row = {
                    "id": row[0],
                    "username": row[1],
                    "email": row[2],
                    "first_name": row[3],
                    "last_name": row[4],
                    "birthday": row[5],
                    "contact": row[6],
                    "created_on": row[7],
                }
                return row

        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def ban_user(id: int):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE accounts
                set status = 'Banned'
                WHERE ID = ?
                """, (id, ))
                conn.commit()
                return True
        except sqlite3.Error as err:
            print(err)
            return False

    @staticmethod
    def unban_user(id: int):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                UPDATE accounts
                set status = 'Active'
                WHERE ID = ?
                """, (id, ))
                conn.commit()
                return True
        except sqlite3.Error as err:
            print(err)
            return False


    @staticmethod
    def user_issues():
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT * FROM user_issues
                ORDER BY ID DESC
                """)

                rows = cursor.fetchall()

                return [
                    {
                        "id": r[0],
                        "first_name": r[1],
                        "last_name": r[2],
                        "email": r[3],
                        "contact": r[4],
                        "user_issue": r[5],
                    }
                for r in rows
                ]
        except sqlite3.Error as err:
            print(err)
            return None





class SqlGameCatalog_API:


    @staticmethod
    def game_search(game_name: str = "", platform: str = "") -> list:
        SqlAdmin.expire_pending_transactions()
        search_format = f"%{game_name}%"
        platform_format = f"%{platform}%"
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT 
                        g.ID,
                        g.game_name,
                        g.cover_image_path,
                        g.price_to_rent,
                        g.platform
                    FROM game_catalog AS g
                    WHERE
                        g.game_name LIKE ? COLLATE NOCASE
                        AND g.platform LIKE ? COLLATE NOCASE
                        AND (
                            g.total_stocks
                            - IFNULL(g.currently_rented, 0)
                            - IFNULL((
                                SELECT SUM(t.quantity)
                                FROM transactions AS t
                                WHERE t.game_id = g.ID
                                AND t.status = 'Pending'
                            ), 0)
                        ) > 0
                """, (search_format, platform_format))

                rows = cursor.fetchall()

                return [
                    {
                        "id": r[0],
                        "name": r[1],
                        "cover_path": r[2],
                        "price_to_rent": r[3]
                    }
                    for r in rows
                ]
        except sqlite3.Error as err:
            print(err)
            return []


    @staticmethod
    def game_rent_info(game_id: int):
        manila_time = ZoneInfo("Asia/Manila")
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()

                cursor.execute("""
                    SELECT
                        g.ID,
                        g.game_name,
                        g.platform,
                        g.total_stocks,
                        g.price_to_rent,
                        IFNULL(SUM(r.quantity), 0) AS rented_quantity,
                        IFNULL(SUM(t.quantity), 0) AS pending_quantity,
                        g.cover_image_path,
                        g.description
                    FROM game_catalog g
                    LEFT JOIN rentals r
                        ON g.ID = r.game_id
                        AND (r.status = 'Ongoing' OR r.status = 'Overdue')
                    LEFT JOIN transactions t
                        ON g.ID = t.game_id
                        AND t.status = 'Pending'
                    WHERE g.ID = ?
                    GROUP BY g.ID
                """, (game_id,))

                row = cursor.fetchone()
                if row is None:
                    print(f"[WARN] No game found with ID={game_id}")
                    return None

                # row indices:
                # 0: ID, 1: name, 2: platform, 3: total_stocks,
                # 4: price_to_rent, 5: rented_quantity, 6: pending_quantity
                remaining_stocks = max(row[3] - row[5] - row[6], 0)

                row = {
                    "game_id": row[0],
                    "game_title": row[1],
                    "console": row[2],
                    "total_stocks": remaining_stocks,
                    "total": row[4],
                    "rental_start_date": datetime.now(manila_time),
                    "cover_image_path": row[7],
                    "description": row[8],
                }

                print(row["rental_start_date"].isoformat())
                return row

        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def check_rent_info_before_transaction(game_id, quantity):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT total_stocks, IFNULL(currently_rented, 0) FROM game_catalog
                WHERE ID = ?
                """, (game_id,))

                row = cursor.fetchone()

                if row is None:
                    return False
                total_stocks, currently_rented = row
                available_stocks = total_stocks - currently_rented
                if quantity > available_stocks:
                    return False


                return True
        except sqlite3.Error as err:
            print(err)
            return False

    @staticmethod
    def check_if_user_is_banned(user_id):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT 1 FROM accounts
                WHERE ID = ? AND status = 'Banned'
                """,(user_id, ))
                row = cursor.fetchone()
                if row is None:
                    return False
                return True
        except sqlite3.Error as err:
            print(err)
            return False




    @staticmethod
    def save_transcation_info(info: UserRentals.RentalFormModel):
        expires_at = (info.rental_start_date + timedelta(minutes=60)).timestamp()
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                INSERT INTO transactions(user_id, user_name, game_id, game_name, rented_on, quantity, total_price, status, return_on, game_console, expires_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                               """,
                (
                 info.userid,
                 info.username,
                 info.game_id,
                 info.game_title,
                 info.rental_start_date,
                 info.quantity,
                 info.total_cost,
                 "Pending",
                 info.return_date,
                 info.console,
                 expires_at
                 )
                    )
                transaction_id = cursor.lastrowid
                conn.commit()
                print(f"Created New Rental from {info.username}")

                return transaction_id
        except sqlite3.Error as err:
            print(err)



class SqlUser:


    @staticmethod
    def list_user_transactions(user_id: int, page: int):
        """List user transactions with pagination"""
        SqlAdmin.expire_pending_transactions()
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT 
                        transactions.ID,
                        transactions.game_name,
                        transactions.game_console,
                        transactions.quantity,
                        transactions.rented_on,
                        transactions.return_on,
                        transactions.total_price,
                        transactions.status,
                        game_catalog.cover_image_path
                    FROM transactions AS transactions
                    LEFT JOIN game_catalog AS game_catalog
                        ON transactions.game_id = game_catalog.ID
                    WHERE transactions.user_id = ?
                    ORDER BY transactions.ID DESC
                """, (user_id,))
                rows = cursor.fetchall()

                return [
                    {
                        "id": r[0],
                        "game_name": r[1],
                        "console": r[2],
                        "quantity": r[3],
                        "rented_on": r[4],
                        "return_on": r[5],
                        "total_price": r[6],
                        "status": r[7],
                        "cover_image_path": r[8],
                    }
                    for r in rows
                ]
        except sqlite3.Error as err:
            print(err)
            return None



    @staticmethod
    def list_user_rentals(user_id: int, page: int):
        """List user rentals with computed overdue totals (not saved)."""
        manila_time = ZoneInfo("Asia/Manila")
        now_ph = datetime.now(manila_time).replace(tzinfo=None)

        try:
            with sqlite3.connect(db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()

                offset = (page - 1) * 10
                cursor.execute("""
                    SELECT
                        rentals.ID,
                        rentals.game_name,
                        transactions.game_console,
                        rentals.quantity,
                        rentals.rented_on,
                        rentals.return_on,
                        rentals.total_price,
                        rentals.status,
                        game_catalog.cover_image_path,
                        rentals.returned_on
                    FROM rentals
                    LEFT JOIN game_catalog
                        ON rentals.game_id = game_catalog.ID
                    LEFT JOIN transactions
                        ON rentals.transaction_id = transactions.ID
                    WHERE rentals.user_id = ? AND rentals.status NOT LIKE 'Returned'
                    ORDER BY rentals.ID DESC
                """, (user_id, ))

                rows = cursor.fetchall()
                result = []

                for r in rows:
                    return_on = datetime.fromisoformat(r["return_on"]).replace(tzinfo=None)
                    days_overdue = max(0, (now_ph.date() - return_on.date()).days)
                    display_price = (
                        r["total_price"] * (2 ** days_overdue)
                        if r["status"] == "Overdue"
                        else r["total_price"]
                    )

                    result.append({
                        "id": r["ID"],
                        "game_name": r["game_name"],
                        "console": r["game_console"],
                        "quantity": r["quantity"],
                        "rented_on": r["rented_on"],
                        "return_on": r["return_on"],
                        "total_price": display_price,
                        "status": r["status"],
                        "cover_image_path": r["cover_image_path"],
                        "returned_on": r["returned_on"],
                        "days_overdue": days_overdue,
                    })

                return result

        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def list_user_completed(user_id: int, page: int):
        """List user completed with pagination"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT
                        rentals.ID,
                        rentals.game_name,
                        transactions.game_console,
                        rentals.quantity,
                        rentals.rented_on,
                        rentals.return_on,
                        rentals.total_price,
                        rentals.status,
                        game_catalog.cover_image_path,
                        rentals.returned_on
                    FROM rentals AS rentals
                    LEFT JOIN game_catalog AS game_catalog
                        ON rentals.game_id = game_catalog.ID
                    LEFT JOIN transactions AS transactions
                        ON rentals.transaction_id = transactions.ID
                    WHERE rentals.user_id = ? AND rentals.status LIKE 'Returned'
                    ORDER BY rentals.ID DESC
                """, (user_id,))
                rows = cursor.fetchall()

                return [
                    {
                        "id": r[0],
                        "game_name": r[1],
                        "console": r[2],
                        "quantity": r[3],
                        "rented_on": r[4],
                        "return_on": r[5],
                        "total_price": r[6],
                        "status": r[7],
                        "cover_image_path": r[8],
                        "returned_on": r[9],
                    }
                    for r in rows
                ]
        except sqlite3.Error as err:
            print(err)
            return None



    @staticmethod
    def contact_us(request: Accounts.contact_us_model):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                INSERT INTO user_issues(first_name, last_name, email, contact, user_issue)
                VALUES (?, ?, ?, ?, ?)
                               """,(
                               request.first_name,
                               request.last_name,
                               request.email,
                               request.contact,
                               request.user_issue,
                                    ))
                conn.commit()
                return True
        except sqlite3.Error as err:
            print(err)
            return False
