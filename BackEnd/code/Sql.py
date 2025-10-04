import sqlite3

from .Accounts import Accounts

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
    def get_username_from_session(session_token: str) -> str | None:
        """Get username from session token"""
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT NAME FROM accounts WHERE session_cookie = ?", (session_token,))
                row = cursor.fetchone()
                if row is None:
                    return None
                return row[0]
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
    def game_catalog_list() -> list:
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT ID, game_name, cover_image_path from game_catalog
                               """)

                row = cursor.fetchall()

                for i in range(len(row)):
                    print(row[i])
                    row[i] = {
                        "id": row[i][0],
                        "name": row[i][1],
                        "cover_path": row[i][2]
                    }

                return row
        except sqlite3.Error as err:
            print(err)
            return []




    @staticmethod
    def game_search(game_name: str) -> list:
        try:
            with sqlite3.connect(db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT ID, game_name, cover_image_path from game_catalog
                    WHERE game_name LIKE '%' || ? || '%' COLLATE NOCASE
                               """, (game_name, ))

                row = cursor.fetchall()

                for i in range(len(row)):
                    print(row[i])
                    row[i] = {
                        "id": row[i][0],
                        "name": row[i][1],
                        "cover_path": row[i][2]
                    }

                return row
        except sqlite3.Error as err:
            print(err)
            return []

