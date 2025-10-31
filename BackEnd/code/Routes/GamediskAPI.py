import asyncio
from typing import Optional
from fastapi import APIRouter, Cookie, Form
from fastapi.responses import JSONResponse
from ..Sql import SqlGameCatalog_API
from ..Validations import UserRentals
from ..Notifications import admin_notify


router = APIRouter()

@router.get("/")
def list_games(game_name_search: Optional[str] = "", platform: str = ""):
    return SqlGameCatalog_API.game_search(game_name_search or "", platform or "")


@router.get("/rent-info")
def rent_info(game_id: int = 0):
    print("rent-info")
    return SqlGameCatalog_API.game_rent_info(game_id)


@router.post("/submit-rent-form")
async def submit_rent_form(
        logged_in: str = Cookie(None),
        request: UserRentals.RentalFormModel = Form(...)
    ):

    print(logged_in)
    print("renting...")

    if SqlGameCatalog_API.check_if_user_is_banned(request.userid):
        return JSONResponse(status_code=400, content={"message": "You have been banned from renting."})

    print(request)
    if SqlGameCatalog_API.check_rent_info_before_transaction(request.game_id, request.quantity):
        transaction_id = SqlGameCatalog_API.save_transcation_info(request)

        asyncio.create_task(admin_notify.notify_admins_new_transaction(request.username, request.game_title, transaction_id or 0))
        return JSONResponse(status_code=200, content={"message": "info added", "transaction_id": transaction_id})
    else:
        return JSONResponse(status_code=400, content={"message": "Looks like the game is out of stock or invalid game please refresh and try again."})

