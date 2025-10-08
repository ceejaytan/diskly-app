from typing import Optional
from fastapi import APIRouter
from ..Sql import SqlGameCatalog_API


router = APIRouter()

@router.get("/")
def list_games(game_name_search: Optional[str] = "", platform: str = ""):
    return SqlGameCatalog_API.game_search(game_name_search
                                          or "")

@router.get("/rent-info")
def rent_info(game_name: str = ""):
    print("rent-info")
    return SqlGameCatalog_API.game_rent_info(game_name)
