from typing import Optional
from fastapi import APIRouter, Cookie, File, Form, HTTPException, Query, UploadFile, WebSocket
from fastapi.responses import JSONResponse
from ..Sql import SqlAdmin
from ..Validations import AdminValidations
from ..Notifications import admin_notify


def admin_secret_key_check(logged_in: str = Cookie(None)):
    if not logged_in or logged_in != "0f32c0fe13ad509e1a2fadbe72d5ad8f7fae769c332d0e34c9ef0fba0cebacb9":
        print("not an admin")
        return True
    return False


router = APIRouter()

@router.get("/rentals")
def view_rentals(
    logged_in: str = Cookie(None),
    page: int = Query(1, ge=1),
    filterby: str = "",
    searchbyname: str = "",
    searchbygame: str = "",
    searchbydate: str = ""
):
    print("viewing rentals")
    return SqlAdmin.view_rentals(
        page,
        filterby.strip(),
        searchbyname.strip(),
        searchbygame.strip(),
        searchbydate.strip()
    )


@router.post("/delete-rental")
def delete_rental(
    logged_in: str = Cookie(None),
    id: int = 0
):
    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    print("deleting a rental...")
    SqlAdmin.delete_rental(id)
    return JSONResponse(status_code=200, content="deleted succesfully")

@router.get("/view-rental-detail")
def view_rental_detail(
    logged_in: str = Cookie(None),
    id: int = 0
):
    return SqlAdmin.view_rental_detail(id)




@router.get("/transactions")
def view_transactions(
    logged_in: str = Cookie(None),
    page: int = Query(1, ge=1),
    filterby: str = "",
    searchbyname: str = "",
    searchbygame: str = "",
    searchbydate: str = "",
):
    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    return SqlAdmin.view_transactions(
        page,
        filterby.strip(),
        searchbyname.strip(),
        searchbygame.strip(),
        searchbydate.strip()
    )


@router.post("/approve-transaction")
def approve_transaction(
    logged_in: str = Cookie(None),
    id: int = 0
):
    print("approving transaction...")

    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    SqlAdmin.approve_transaction(id)
    SqlAdmin.insertinto_rentals(id)

@router.post("/deny-transaction")
def deny_transaction(
    logged_in: str = Cookie(None),
    id: int = 0
):

    print("denying transaction...")
    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    SqlAdmin.deny_transaction(id)




@router.post("/delete-transaction")
def delete_transaction(
    logged_in: str = Cookie(None),
    id: int = 0
):

    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    print("deleting a rental...")
    SqlAdmin.delete_transaction(id)
    return JSONResponse(status_code=200, content="deleted succesfully")


@router.get("/view-game-detail")
def view_game_detail(id: int = 0):
    return SqlAdmin.view_game_detail(id)




@router.get("/games")
def view_games(
    page: int = Query(1, ge=1),
    filterby: str = "",
    searchbygame: str = "",
    searchbydate: str = ""
):
    print("Viewing Games...")
    return SqlAdmin.view_games(
        page,
        searchbygame.strip(),
        searchbydate.strip(),
        filterby.strip()
    )


@router.get("/low-stock-games")
def low_stock_games():
    print("Viewing Low Stock Games...")
    return SqlAdmin.low_stock_games()
    # return []



@router.post("/add_game")
async def add_game(
    logged_in: str = Cookie(None),
    game_name: str = Form(...),
    game_description: str = Form(...),
    platform: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    image: Optional[UploadFile] = File(None)
):

    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    request = AdminValidations.add_games_model(
        game_name=game_name,
        description=game_description,
        platform=platform,
        price=price,
        quantity=quantity
    )
    print(request)
    cover_image_path = "images/gamecover/DEFAULT_PIC.png"

    if image:
        cover_image_path = await AdminValidations.image_valid(image, request.game_name)
        if cover_image_path == "":
            raise HTTPException(status_code=400, detail="Invalid Image, Image size must be less than 2MB")

    SqlAdmin.add_game(request, cover_image_path)


@router.post("/update-game")
async def update_game(
    logged_in: str = Cookie(None),
    game_id: int = Form(...),
    game_name: str = Form(...),
    game_description: str = Form(...),
    platform: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    image: Optional[UploadFile] = File(None)
):

    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    request = AdminValidations.add_games_model(
        game_name=game_name,
        description=game_description,
        platform=platform,
        price=price,
        quantity=quantity
    )
    print( request )
    if image is None:
        SqlAdmin.update_game_no_image(game_id, request)
    else:
        old_image_path = SqlAdmin.get_gamecd_cover(game_id)
        cover_image_path = await AdminValidations.image_valid(image, request.game_name, old_image_path)
        if cover_image_path == "":
            raise HTTPException(status_code=400, detail="Invalid Image, Image size must be less than 2MB")
        SqlAdmin.update_game_w_image(game_id, request, cover_image_path)
    return JSONResponse(status_code=200, content="Updated game CD")





@router.post("/delete_game")
def delete_game(
    logged_in: str = Cookie(None),
    game_id: int = 0
):
    print("deleting game...")
    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    if SqlAdmin.check_if_can_delete_game(game_id):
        SqlAdmin.delete_game(game_id)
        return JSONResponse(status_code=200, content="deleted succesfully")
    else:

        raise HTTPException(status_code=400, detail="Cannot delete game, there are active rentals for this game.")




@router.get("/Transactions-more-info")
def Transactions_more_info(id: int):
    print()
    # TODO
    


@router.post("/confirm-return-rental")
def return_rental(
    logged_in: str = Cookie(None),
    id: int = 0,
    total_price: int = 0
):

    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    SqlAdmin.confirm_return(id, total_price)
    return {"returned"}


@router.get("/customers")
def view_customers(
    page: int = Query(1, ge=1),
    searchbyname: str = "",
    searchbyemail: str = "",
    searchbycontact: str = "",
    searchbystatus: str = ""
):
    print("Viewing Customers...")

    if searchbycontact.startswith("0"):
        searchbycontact = searchbycontact[1:]

    return SqlAdmin.view_customers(
        page,
        searchbyname.strip(),
        searchbyemail.strip(),
        searchbycontact.strip(),
        searchbystatus.strip()
    )


@router.get("/customer-info")
def view_customer_info(id: int):
    print(f"viewing userID: ${id} ")
    return SqlAdmin.view_customer_info(id)


@router.post("/ban-user")
def ban_user(
    logged_in: str = Cookie(None),
    id: int = 0,
):

    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    if SqlAdmin.ban_user(id):
        return {"detail": "succesfully banned user"}
    else:
        raise HTTPException(status_code=400, detail="Failed to ban user")



@router.post("/unban-user")
def unban_user(
    logged_in: str = Cookie(None),
    id: int = 0,
):

    if admin_secret_key_check(logged_in):
        raise HTTPException(status_code=400, detail="Your not an admin")

    if SqlAdmin.unban_user(id):
        return {"detail": "succesfully unbanned user"}
    else:
        raise HTTPException(status_code=400, detail="Failed to unban user")


@router.get("/user-issues")
def user_issues():
    print("showing user issues...")
    return SqlAdmin.user_issues()



@router.websocket("/ws/notify-transaction-made")
async def notify_transaction_made(ws: WebSocket):
    await ws.accept()
    admin_notify.active_admins.append(ws)
    print("WebSocket connected for transaction notifications.")
    try:
        while True:
            await ws.receive_text()
    except Exception as e:
        print("WebSocket disconnected:", e)
    finally:
        admin_notify.active_admins.remove(ws)
        print(f"Active connections: { len(admin_notify.active_admins) }")

