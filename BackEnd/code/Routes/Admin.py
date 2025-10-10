import re
from typing import Optional
from fastapi import APIRouter, Cookie, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from ..Sql import SqlAdmin
from ..Validations import AdminValidations




router = APIRouter()


@router.get("/rentals")
def view_rentals(
    logged_in: str = Cookie(None)
):
    print("viewing rentals")
    if not logged_in or logged_in != "0f32c0fe13ad509e1a2fadbe72d5ad8f7fae769c332d0e34c9ef0fba0cebacb9":
        print("not an admin")
        raise HTTPException(status_code=400, detail="Your not an admin")

    return SqlAdmin.view_rentals()

@router.post("/delete-rental")
def delete_rental(
    logged_in: str = Cookie(None),
    rental_id: int = 0
):

    if not logged_in or logged_in != "0f32c0fe13ad509e1a2fadbe72d5ad8f7fae769c332d0e34c9ef0fba0cebacb9":
        print("not an admin")
        raise HTTPException(status_code=400, detail="Your not an admin")
    print("deleting a rental...")
    SqlAdmin.delete_rental(rental_id)
    return JSONResponse(status_code=200, content="deleted succesfully")



@router.get("/games")
def view_games():
    print("Viewing Games...")
    return SqlAdmin.view_games()



@router.post("/add_game")
async def add_game(
    game_name: str = Form(...),
    platform: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    image: Optional[UploadFile] = File(None)
):

    request = AdminValidations.add_games_model(
        game_name=game_name,
        platform=platform,
        price=price,
        quantity=quantity
    )

    print(request)

    cover_image_path = "images/gamecover/DEFAULT_PIC.png"
    game_name_regex = r"^[A-Za-z0-9\s\-'!]{2,100}$"

    if image:

        cover_image_path = await AdminValidations.image_valid(image, request.game_name)
        if cover_image_path == "":
            raise HTTPException(status_code=400, detail="Invalid Image, Image size must be less than 2MB")

    # if not re.match(game_name_regex, game_name):
    #     raise HTTPException(status_code=400, detail="Invalid Name")

    # if not AdminValidations.Add_games_valid(request):
    #     raise HTTPException(status_code=400, detail="Invalid Request")

    SqlAdmin.add_game(request, cover_image_path)


@router.post("/delete_game")
def delete_game(
    logged_in: str = Cookie(None),
    game_id: int = 0
):
    print("deleting game...")

    if not logged_in or logged_in != "0f32c0fe13ad509e1a2fadbe72d5ad8f7fae769c332d0e34c9ef0fba0cebacb9":
        print("not an admin")
        raise HTTPException(status_code=400, detail="Your not an admin")

    SqlAdmin.delete_game(game_id)
    return JSONResponse(status_code=200, content="deleted succesfully")



