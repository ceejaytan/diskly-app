import bcrypt

admin_pass = "admin"

def hash_password(plain_password: str):
    """hash password"""
    return bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


if __name__ == "__main__":
    print(hash_password(admin_pass))

