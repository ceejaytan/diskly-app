from datetime import date, datetime
from zoneinfo import ZoneInfo
import sqlite3

from .Accounts import Accounts
from .Validations import UserRentals
from .Validations import AdminValidations

db_path = "db/sqlite.db"

class SqlAccounts:

    @staticmethod
    def create_table():
        """Initialize accounts table if not exists."""
        with sqlite3.connect(db_path) as conn:

            cursor = conn.cursor()

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS accounts (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    NAME TEXT UNIQUE NOT NULL,
                    HASHED_PASSWORD TEXT NOT NULL)
                    """)

            conn.commit()


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
                cursor.execute("SELECT ID, NAME FROM accounts WHERE session_cookie = ?", (session_token,))
                row = cursor.fetchone()
                if row is None:
                    return None
                return [ row[0], row[1] ]
        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def register(username: str, plain_password: str, email: str) -> bool:
        """Register validation"""
        hashpw_pw = Accounts.hash_password(plain_password)

        if SqlAccounts.checkString_Iftaken("NAME", username):
            print(f"Username:{username} Already taken")
            return False

        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO accounts(NAME, HASHED_PASSWORD, EMAIL)
                    VALUES( ?, ?, ? )
                    """, (username, hashpw_pw, email, ))
                conn.commit()
            return True
        except sqlite3.Error:
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
    def view_rentals():
        """View rentals for admin dashboard rentals page.
        Automatically mark overdue rentals if past return_on time.
        """
        manila_time = ZoneInfo("Asia/Manila")

        try:
            with sqlite3.connect(db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()

                cursor.execute("""
                    SELECT ID, user_name, game_name, rented_on, return_on, total_price, status
                    FROM rentals
                """)
                rows = cursor.fetchall()

                if not rows:
                    return []

                now_ph = datetime.now(manila_time)

                for row in rows:
                    return_on = row["return_on"]
                    if not return_on:
                        continue

                    try:
                        return_on_dt = datetime.fromisoformat(return_on)
                    except Exception:
                        continue

                    if return_on_dt < now_ph and row["status"] == "Ongoing":
                        cursor.execute(
                            "UPDATE rentals SET status = 'Overdue' WHERE ID = ?",
                            (row["ID"],)
                        )

                conn.commit()

                cursor.execute("""
                    SELECT ID, user_name, game_name, rented_on, return_on, total_price, status, transaction_id, game_id
                    FROM rentals
                """)
                updated_rows = cursor.fetchall()

                rentals = [
                    {
                        "id": r["ID"],
                        "name": r["user_name"],
                        "title": r["game_name"],
                        "rented_on": r["rented_on"],
                        "return_on": r["return_on"],
                        "price": r["total_price"],
                        "status": r["status"],
                        "transaction_id": r["transaction_id"],
                        "game_id": r["game_id"],
                    }
                    for r in updated_rows
                ]

                return rentals

        except sqlite3.Error as err:
            print(err)
            return None

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

            # Update currently_rented in game_catalog
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

            conn.commit()
        except sqlite3.Error as err:
            print(err)


    @staticmethod
    def view_transactions():
        """view transactions for admin dashboard transactions page"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT ID, user_name, game_name, rented_on, return_on, total_price, status, quantity, game_console FROM transactions
                ORDER BY ID desc
                """)
                row = cursor.fetchall()

                if row is None:
                    return []
            transactions = []
            for row in row:
                transactions.append({
                    "id": row[0],
                    "name": row[1],
                    "title": row[2],
                    "rented_on": row[3],
                    "return_on": row[4],
                    "price": row[5],
                    "status": row[6],
                    "quantity": row[7],
                    "console": row[8]
                })

            return transactions
        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def view_games():
        """View game titles for admin dashboard stock page"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
            # what the f is this??
            # its pretty good tho
                cursor.execute("""
                    SELECT
                        g.ID,
                        g.game_name,
                        g.date_added,
                        g.total_stocks,
                        IFNULL(SUM(r.quantity), 0) AS rented_quantity
                    FROM game_catalog g
                    LEFT JOIN rentals r
                        ON g.ID = r.game_id
                        AND ( r.status = 'Ongoing' OR r.status = 'Overdue' )
                    GROUP BY g.ID
                """)

                rows = cursor.fetchall()

                gametitles = []
                for row in rows:
                    game_id, name, date_added, total, rented = row
                    remaining = max(total - rented, 0)
                    gametitles.append({
                        "id": game_id,
                        "Title": name,
                        "Date_Added": date_added,
                        "Quantity": f"{remaining}/{total}",
                        "status": "Available" if remaining > 0 else "Out of Stock"
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
    def add_game(game_info: AdminValidations.add_games_model, cover_image_path: str) -> bool:
        """Admin Add Game"""
        print("add game")

        manila_time = ZoneInfo("Asia/Manila")
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO game_catalog (game_name, platform, price_to_rent, total_stocks, cover_image_path, date_added)
                    VALUES ( ?, ?, ?, ?, ?, ?)
                               """, 
                    (game_info.game_name, game_info.platform, game_info.price, game_info.quantity, cover_image_path, datetime.now(manila_time))
                                     )

                conn.commit()
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
            conn.commit()
            return True
        except sqlite3.Error as err:
            print(err)
            return False



class SqlGameCatalog_API:


    @staticmethod
    def game_search(game_name: str = "", platform: str = "") -> list:
        search_format = f"%{game_name}%"
        platform_format = f"%{platform}%"
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT ID, game_name, cover_image_path, price_to_rent, platform from game_catalog
                    WHERE
                    game_name LIKE ? COLLATE NOCASE
                    AND platform LIKE ? COLLATE NOCASE
                    AND ( total_stocks - IFNULL( currently_rented, 0 ) ) > 0
                               """, (search_format, platform_format ))

                row = cursor.fetchall()

                for i in range(len(row)):
                    row[i] = {
                        "id": row[i][0],
                        "name": row[i][1],
                        "cover_path": row[i][2],
                        "price_to_rent": row[i][3]
                    }

                return row
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
                        IFNULL(SUM(r.quantity), 0) AS rented_quantity
                    FROM game_catalog g
                    LEFT JOIN rentals r
                        ON g.ID = r.game_id
                        AND ( r.status = 'Ongoing' OR r.status = 'Overdue' )
                    WHERE g.ID = ?
                    GROUP BY g.ID
                """, (game_id,))

                row = cursor.fetchone()
                remaining_stocks = max(row[3] - row[5], 0)
                row = {
                    "game_id": row[0],
                    "game_title": row[1],
                    "console": row[2],
                    "total_stocks": remaining_stocks,
                    "total": row[4],
                    "rental_start_date": datetime.now(manila_time)
                }
                print(row["rental_start_date"].isoformat())

                return row
        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def save_transcation_info(info: UserRentals.RentalFormModel):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                INSERT INTO transactions(user_id, user_name, game_id, game_name, rented_on, quantity, total_price, status, return_on, game_console)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                               """,
                (info.userid, info.username, info.game_id, info.game_title, info.rental_start_date, info.quantity, info.total_cost, "Pending", info.return_date, info.console))
                conn.commit()
                print(f"Created New Rental from {info.username}")

        except sqlite3.Error as err:
            print(err)

