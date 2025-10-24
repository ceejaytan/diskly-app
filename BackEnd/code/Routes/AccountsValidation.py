import random
from fastapi import APIRouter, BackgroundTasks, HTTPException, Response, Form, Cookie
import secrets
import re

from fastapi.responses import JSONResponse
from ..Sql import Accounts, SqlAccounts


router = APIRouter()

cookie_setting = {
    "httponly":True,
    "secure":True,
    "samesite":"none",
}

@router.get("/")
def root():
    return "wassup 🗿🗿🗿"

@router.post("/login")
def login(
    response: Response,
    request: Accounts.LoginRequest = Form(...)
    ):

    if request.username.strip() == "admin" and request.password == "admin":

        print("admin login")
        response.set_cookie(
            key="logged_in",
            value="0f32c0fe13ad509e1a2fadbe72d5ad8f7fae769c332d0e34c9ef0fba0cebacb9",
            max_age=7*24*60*60,
            **cookie_setting
            )
        return {"status": "success"}

    elif SqlAccounts.login(request.username.strip(), request.password):
        session_token = secrets.token_hex(32)
        response.set_cookie(
            key="logged_in",
            value=session_token,
            max_age=7*24*60*60,
            **cookie_setting
        )
        SqlAccounts.store_session(session_token, request.username.strip())
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
    if SqlAccounts.register(request):
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

@router.get("/check-contact")
def check_contact(contact: str):
    taken = SqlAccounts.checkString_Iftaken("contact", contact.strip())
    return {"Available": not taken}


@router.get("/check-session-logged-in")
def check_session(logged_in: str = Cookie(None)):
    print(logged_in, end=": ")

    if not logged_in:
        print("not logged in")
        return None

    userinfo = SqlAccounts.get_username_from_session(logged_in)

    if userinfo is None:
        print("not logged in")
        return None

    print(f"User {userinfo} is logged in")
    return {
            "user_id": userinfo[0],
            "username": userinfo[1],
            "status": userinfo[2],
            "logged_in": 1
            }


@router.get("/logout")
def logout(response: Response):

    print(response)
    response.delete_cookie(
        key="logged_in",
        **cookie_setting
            )
    return {"message": "successfully logged out!"}


@router.post("/forget-password-sendcode")
def forget_password_sendcode(
    background_task: BackgroundTasks,
    email: str,
    credentials: Response
):
    print("forget password send code")

    session_token = secrets.token_hex(16)
    credentials.set_cookie(
            key="reset_pass",
            value=session_token,
            max_age=60*60,
            **cookie_setting
            )

    code = str(random.randint(100000, 999999))

    background_task.add_task(Accounts.send_reset_pass, email, code)
    SqlAccounts.store_reset_password(email, code, session_token)
    return {"sent code"}


@router.post("/forget-password-verify")
def forget_password_verify(
    credentials: Response,
    code: str = Form(...),
    email: str = Form(...),
    reset_pass: str = Cookie(None),
    verified_reset_pass: str = Cookie(None)
):
    print("forget password verify")
    print(reset_pass)
    print(verified_reset_pass)
    
    if SqlAccounts.verify_reset_password(code, email, reset_pass):
        print("verified to reset")
        credentials.set_cookie(
            key="verified_reset_pass",
            value=reset_pass,
            max_age=60*60,
            **cookie_setting
            )
        SqlAccounts.increase_timer_forgetpass(code, email, reset_pass)
        return JSONResponse(status_code=200, content=1)
    else:
        print("not verified to reset")
        raise HTTPException(status_code=400, detail=0)

@router.post("/change-password")
def change_password(
        credentials: Response,
        verify_reset_password: str = Cookie(None),
        email: str = Form(...),
        new_password: str = Form(...)
    ):
    print("change password")
    print(verify_reset_password)
    if SqlAccounts.change_password(email, new_password):
        credentials.delete_cookie(key="reset_pass")
        credentials.delete_cookie(key="verify_reset_password")
        SqlAccounts.cleanup_forgetpass_session(email)
        return {"detail": "successfully changed password"}
    else:
        raise HTTPException(status_code=400, detail="something went wrong")


