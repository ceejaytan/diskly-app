from typing import Optional
from fastapi import APIRouter
from ..Sql import SqlGameCatalog_API


router = APIRouter()

@router.get("/")
def list_games(game_name_search: Optional[str] = "", platform: str = ""):

    db_games = []

    if game_name_search:
        db_games = SqlGameCatalog_API.game_search(game_name_search)
    else:
        db_games = SqlGameCatalog_API.game_catalog_list()

    return db_games


