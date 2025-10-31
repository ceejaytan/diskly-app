from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


from .Routes.AccountsValidation import router as accounts_router
from .Routes.GamediskAPI import router as GamediskAPI
from .Routes.Admin import router as Admin
from .Routes.User import router as UserRouter


from .Sql import InitializeTables


@asynccontextmanager
async def lifespan(app: FastAPI):

    if InitializeTables.SqliteFile_Exists():
        InitializeTables.create_tables()
        print(f"""
        {app.title}
            """)
    else:
        print("db/sqlite.db doesnt exist, creating...")
        InitializeTables.create_sqlite_file()
        InitializeTables.create_tables()

    yield
    print("closing...")


app = FastAPI(lifespan=lifespan)

app.title = "GameDISK rental API"

origins = [
    "https://diskly-mockup.web.app",
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
app.include_router(UserRouter, prefix="/user")


@app.get("/")
def root():
    return 1


