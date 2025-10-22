from fastapi import APIRouter
from ..Sql import SqlUser



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
