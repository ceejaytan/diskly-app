from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from ..Sql import SqlAdmin
from ..Validations import AdminValidations




router = APIRouter()




@router.post("/add_game")
async def add_game(
    game_name: str = Form(...),
    description: str = Form(...),
    platform: str = Form(...),
    genre: str = Form(...),
    price_to_rent: float = Form(...),
    total_stocks: int = Form(...),
    image: Optional[UploadFile] = File(None)
):

    request = AdminValidations.add_games_model(
        game_name=game_name,
        description=description,
        platform=platform,
        genre=genre,
        price_to_rent=price_to_rent,
        total_stocks=total_stocks
    )
    print(request)

    cover_image_path = "images/gamecover/Gustavo_fring.png"

    if image:

        cover_image_path = await AdminValidations.image_valid(image, request.game_name)
        if cover_image_path == "":
            raise HTTPException(status_code=400, detail="Invalid Image")

    if not AdminValidations.Add_games_valid(request):
        raise HTTPException(status_code=400, detail="Invalid Request")

    SqlAdmin.add_game(request.game_name,
                      request.description,
                      request.platform,
                      request.genre,
                      request.price_to_rent,
                      request.total_stocks,
                      cover_image_path)


