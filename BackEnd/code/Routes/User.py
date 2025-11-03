from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from ..Sql import SqlUser
from ..Accounts import Accounts


router = APIRouter()


@router.get("/user-transactions")
def user_transactions(
    user_id: int = 0,
    page: int = 1
):
    print("fetching user transactions")
    return SqlUser.list_user_transactions(user_id, page)


@router.get("/user-rentals")
def user_rentals(
    user_id: int = 0,
    page: int = 1
):
    print("fetching user rentals")
    return SqlUser.list_user_rentals(user_id, page)


@router.get("/user-completed")
def user_completed(
    user_id: int = 0,
    page: int = 1
):
    print("fetching user completed")
    return SqlUser.list_user_completed(user_id, page)



@router.post("/contact-us")
def contact_us(
        request:Accounts.contact_us_model = Form(...)
):
    print("contact us request...")
    if SqlUser.contact_us(request):
        return JSONResponse(status_code=200, content={"message": "successfully sent."})
    else:
        return JSONResponse(status_code=400, content={"message": "Something went wrong."})



@router.get("/user-info")
def user_info(id: int):
    print("user info")
    return SqlUser.user_info(id)


