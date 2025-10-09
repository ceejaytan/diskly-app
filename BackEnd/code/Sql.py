from datetime import datetime
from zoneinfo import ZoneInfo
import sqlite3

from .Accounts import Accounts
from .Validations import UserRentals

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
    def view_rentals():
        """view rentals for admin dashboard rentals page"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT ID, user_name, game_name, rented_on, return_on, total_price, status FROM rentals
                """)
                row = cursor.fetchall()

                if row is None:
                    return []
            rentals = []
            for row in row:
                rentals.append({
                    "id": row[0],
                    "name": row[1],
                    "title": row[2],
                    "rented_on": row[3],
                    "return_on": row[4],
                    "price": row[5],
                    "status": row[6],
                })

            return rentals
        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def view_games():
        """view game titles for admin dashboard stock page"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT ID, game_name, date_added, total_stocks FROM game_catalog
                """)
                row = cursor.fetchall()

                if row is None:
                    return []
            gametitles = []
            for row in row:
                gametitles.append({
                    "id": row[0],
                    "Title": row[1],
                    "Date_Added": row[2],
                    "Quantity": row[3],
                    "status": "Available" if row[3] > 0 else "Out of Stock"
                })

            return gametitles
        except sqlite3.Error as err:
            print(err)
            return None

    @staticmethod
    def delete_rental(id: int):
        """Admin delete rental record from table rentals"""
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
    def add_game(game_name: str, cover_image_path: str) -> bool:
        """Admin Add Game"""
        print("add game")

        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO game_catalog (game_name, cover_image_path)
                    VALUES ( ?, ? )
                               """, (game_name,
                                     cover_image_path)
                                     )

                conn.commit()
                return True
        except sqlite3.Error as err:
            print(err)
            return False


    # @staticmethod
    # def add_game(game_name: str, description: str, platform: str, genre: str, price_to_rent: float, total_stocks: int, cover_image_path: str) -> bool:
    #     """Admin Add Game"""
    #     print("add game")
    #
    #     try:
    #         with sqlite3.connect(db_path) as conn:
    #             cursor = conn.cursor()
    #             cursor.execute("""
    #                 INSERT INTO game_catalog (game_name, description, platform, genre, price_to_rent, total_stocks, cover_image_path)
    #                 VALUES ( ?, ?, ?, ?, ?, ?, ? )
    #                            """, (game_name,
    #                                  description,
    #                                  platform,
    #                                  genre,
    #                                  price_to_rent,
    #                                  total_stocks,
    #                                  cover_image_path)
    #                                  )
    #
    #             conn.commit()
    #             return True
    #     except sqlite3.Error as err:
    #         print(err)
    #         return False



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
                    AND total_stocks > 0
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
    def game_rent_info(game_name: str):
        manila_time = ZoneInfo("Asia/Manila")
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                SELECT ID, game_name, platform, total_stocks, price_to_rent FROM game_catalog
                WHERE game_name = ?
                               """, (game_name,))

                row = cursor.fetchone()
                row = {
                    "game_id": row[0],
                    "game_title": row[1],
                    "console": row[2],
                    "total_stocks": row[3],
                    "total": row[4],
                    "rental_start_date": datetime.now(manila_time)
                }
                print(row["rental_start_date"].isoformat())

                return row
        except sqlite3.Error as err:
            print(err)
            return None


    @staticmethod
    def save_rental_info(info: UserRentals.RentalFormModel):
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                INSERT INTO rentals(user_id, user_name, game_id, game_name, rented_on, quantity, total_price, status, return_on)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                               """,
                (info.userid, info.username, info.game_id, info.game_title, info.rental_start_date, info.quantity, info.total_cost, "Pending", info.return_date))
                conn.commit()
                print(f"Created New Rental from {info.username}")

        except sqlite3.Error as err:
            print(err)

