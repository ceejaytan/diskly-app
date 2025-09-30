from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .Sql import SqlAccounts
from .Routes.AccountsValidation import router as accounts_router
from .Routes.GamediskAPI import router as GamediskAPI
from .Routes.Admin import router as Admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"""
    {app.title}
    creating table Accounts if not exists
          """)
    SqlAccounts.create_table()
    yield
    print("closing...")


app = FastAPI(lifespan=lifespan)

app.title = "GameDISK rental API"

origins = [
    "http://localhost:6969",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/images", StaticFiles(directory="images"), name="images")
app.mount("/images/gamecover", StaticFiles(directory="images/gamecover"), name="GameCover")


app.include_router(accounts_router, prefix="/accounts")
app.include_router(GamediskAPI, prefix="/games")
app.include_router(Admin, prefix="/admin")


@app.get("/")
def root():
    return 1


