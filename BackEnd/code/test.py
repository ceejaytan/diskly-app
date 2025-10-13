# import bcrypt
#
# admin_pass = "admin"
#
# def hash_password(plain_password: str):
#     """hash password"""
#     return bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
#
#

import time


if __name__ == "__main__":
    while True:
        print(int( time.time() ))
        time.sleep(1)

