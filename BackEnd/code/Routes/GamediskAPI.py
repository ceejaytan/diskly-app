from typing import Optional
from fastapi import APIRouter
from ..Sql import SqlGameCatalog_API


router = APIRouter()

@router.get("/")
def list_games(game_name_search: Optional[str] = ""):

    print("hello games list")
    print(game_name_search)

    # list_games = [
    #     {"id": "1", "name": "Overcooked 2", "cover_path": "images/gamecover/Overcooked 2.png"},
    #     {"id": "2", "name": "hollow knight", "cover_path": "images/gamecover/Hollow Knight.png"},
    #     {"id": "3", "name": "Legend Of Zelda", "cover_path": "images/gamecover/Legend Of Zelda.jpg"},
    #     {"id": "4", "name": "Mario Odyssey", "cover_path": "images/gamecover/Mario Odyssey.jpg"},
    #     {"id": "5", "name": "Astro Bot", "cover_path": "images/gamecover/Astro Bot.webp"},
    # ]
    #
    db_games = []

    if game_name_search:
        db_games = SqlGameCatalog_API.game_search(game_name_search)
    else:
        db_games = SqlGameCatalog_API.game_catalog_list()

    # db_games.extend(list_games)

    print(db_games)
    return db_games


