import smtplib
import bcrypt
from pydantic import BaseModel
from email.mime.text import MIMEText

class Accounts:

    class LoginRequest(BaseModel):
        username: str
        password: str


    class RegisterRequest(BaseModel):
        firstname: str
        lastname: str
        username: str
        email: str
        birthday: str
        contact: str
        password: str
        confirmpassword: str


    class contact_us_model(BaseModel):
        first_name: str
        last_name: str
        email: str
        contact: str
        user_issue: str


    forget_pass_email = "diskly.forgetpass@gmail.com"
    forget_pass_email_app_pass = "ahru uclf oics ohjr"


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


    @staticmethod
    def send_reset_pass(email: str, code: str) -> str:
        msg = MIMEText(
        f"""
        <html>
        <body>
            <p>Hello,</p>
            <p>We received a request to reset your password.</p>
            <p>Here is your verification code:</p>
            <br>
            <h1>{code}</h1>
            <br>
            <p>If you didn’t request this, please ignore this email.</p>
            <br>
            <p>------------------</p>
            <p>This message was sent as part of a school project for educational purposes.</p>
            <p><a href="https://diskly-mockup.web.app">https://diskly-mockup.web.app</a></p>
        </body>
        </html>
        """,
        "html"
        )
        msg["Subject"] = "Password Reset"
        msg["From"] = Accounts.forget_pass_email
        msg["To"] = email

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(Accounts.forget_pass_email, Accounts.forget_pass_email_app_pass)
            server.send_message(msg)

        return code
