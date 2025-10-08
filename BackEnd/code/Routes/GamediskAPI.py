from typing import Optional
from fastapi import APIRouter, Cookie, Form
from ..Sql import SqlGameCatalog_API
from ..Validations import UserRentals


router = APIRouter()

@router.get("/")
def list_games(game_name_search: Optional[str] = "", platform: str = ""):
    return SqlGameCatalog_API.game_search(game_name_search or "", platform or "")


@router.get("/rent-info")
def rent_info(game_name: str = ""):
    print("rent-info")
    return SqlGameCatalog_API.game_rent_info(game_name)


@router.post("/submit-rent-form")
def submit_rent_form(
        cookie: str = Cookie(None),
        request: UserRentals.RentalFormModel = Form(...)
    ):

    print("renting...")
    print(request)
    SqlGameCatalog_API.save_rental_info(request)
    return {"message": "success"}
