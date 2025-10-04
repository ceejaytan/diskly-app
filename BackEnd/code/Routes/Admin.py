import re
from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from ..Sql import SqlAdmin
from ..Validations import AdminValidations




router = APIRouter()




@router.post("/add_game")
async def add_game(
    game_name: str = Form(...),
    image: Optional[UploadFile] = File(None)
):

    # request = AdminValidations.add_games_model(
    #     game_name=game_name,
    #     description=description,
    #     platform=platform,
    #     genre=genre,
    #     price_to_rent=price_to_rent,
    #     total_stocks=total_stocks
    # )
    # print(request)

    cover_image_path = "images/gamecover/DEFAULT_PIC.png"
    game_name_regex = r"^[A-Za-z0-9\s\-'!]{2,100}$"

    if image:

        cover_image_path = await AdminValidations.image_valid(image, game_name)
        if cover_image_path == "":
            raise HTTPException(status_code=400, detail="Invalid Image")

    if not re.match(game_name_regex, game_name):
        raise HTTPException(status_code=400, detail="Invalid Name")

    # if not AdminValidations.Add_games_valid(request):
    #     raise HTTPException(status_code=400, detail="Invalid Request")

    SqlAdmin.add_game(game_name,
                      cover_image_path)


