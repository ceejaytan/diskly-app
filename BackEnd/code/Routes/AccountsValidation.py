from fastapi import APIRouter, HTTPException, Response, Form, Cookie
import secrets
import re
from ..Sql import Accounts, SqlAccounts

router = APIRouter()

cookie_setting = {
    "httponly":True,
    "secure":False,
    "samesite":"lax",
}

@router.get("/")
def root():
    return "wassup 🗿🗿🗿"

@router.post("/login")
def login(
    respone: Response,
    request: Accounts.LoginRequest = Form(...)
    ):
    print(request)
    if SqlAccounts.login(request.username, request.password):
        print(respone)
        session_token = secrets.token_hex(32)
        respone.set_cookie(
            key="logged_in",
            value=session_token,
            max_age=7*24*60*60,
            **cookie_setting
        )
        SqlAccounts.store_session(session_token, request.username)
        return {"status": "success"}
    else:
        raise HTTPException(status_code=400, detail={"status": "failed"})


@router.post("/register")
def register(
    response: Response,
    request: Accounts.RegisterRequest = Form(...)
    ):

    if not re.match(Accounts.USERNAME_REGEX, request.username) or \
        not re.match(Accounts.EMAIL_REGEX, request.email) or \
        SqlAccounts.checkString_Iftaken("NAME", request.username) or \
        request.password != request.confirmpassword:

        # not re.match(Accounts.PASSWORD_REGEX, request.password) or \

        raise HTTPException(status_code=400, detail="Invalid Input")

    print("register valid")
    print(response)
    if SqlAccounts.register(request.username.strip(), request.password, request.email.strip()):
        session_token = secrets.token_hex(16)
        response.set_cookie(
            key="logged_in",
            value=session_token,
            httponly=True,
            secure=False,
            max_age=7*24*60*60
        )
        SqlAccounts.store_session(session_token, request.username.strip())
    else:
        raise HTTPException(status_code=400, detail="invalid account")

    return {"detail": "valid"}


@router.get("/check-username")
def check_username(username: str):
    taken: bool = SqlAccounts.checkString_Iftaken("NAME", username.strip())
    return {"Available": not taken}


@router.get("/check-email")
def check_email(email: str):
    taken = SqlAccounts.checkString_Iftaken("EMAIL", email.strip())
    return {"Available": not taken}


@router.get("/check-session-logged-in")
def check_session(logged_in: str = Cookie(None)):
    print(logged_in)

    if not logged_in:
        print("not logged in")
        return {
                "username": None,
                "logged_in": 0}

    username = SqlAccounts.get_username_from_session(logged_in)

    if username is None:
        print("not logged in")
        return {
                "username": None,
                "logged_in": 0}

    print(f"User {username} is logged in")
    return {
            "username": username,
            "logged_in": 1}


@router.get("/logout")
def logout(response: Response):

    print(response)
    response.delete_cookie(
        key="logged_in",
        **cookie_setting
            )
    return {"message": "successfully logged out!"}

