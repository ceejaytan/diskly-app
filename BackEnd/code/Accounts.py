import bcrypt
from pydantic import BaseModel

class Accounts:

    class LoginRequest(BaseModel):
        username: str
        password: str


    class RegisterRequest(BaseModel):
        fullname: str
        username: str
        email: str
        birthday: str
        contact: str
        password: str
        confirmpassword: str

    EMAIL_REGEX = r"^[A-Za-z0-9._+-]{3,20}@[^\s@]+\.[A-Za-z]{2,}$"
    USERNAME_REGEX = r"^(?=[A-Za-z0-9_]{3,20}$)(?!.*_$)(?!.*__)(?=(?:.*[A-Za-z]){3,})[A-Za-z][A-Za-z0-9_]{2,20}$"
    # PASSWORD_REGEX = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
    FULLNAME_REGEX = r"^(?:[A-Za-z]\.|[A-Za-z][A-Za-z'\-]*)(?: (?:[A-Za-z]\.|[A-Za-z][A-Za-z'\-]*)){1,3}$"
    CONTACT_REGEX = r"^(?:\+639|09)\d{9}$"

    @staticmethod
    def hash_password(plain_password: str):
        """hash password"""
        return bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def check_hashpw(plain_password: str, hashpw: str) -> bool:
        """check hash password"""
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashpw.encode("utf-8"))
