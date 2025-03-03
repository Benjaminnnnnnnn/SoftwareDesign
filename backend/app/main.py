from fastapi import FastAPI, HTTPException
from app.routers import board_router, user_router
from app.crud.board_crud import get_all_boards, create_board, fetch_board
from app.schemas.board_schema import BoardCreate

app = FastAPI()

# Include the boards router
app.include_router(board_router.router)
app.include_router(user_router.router)

@app.get("/")
def read_root():
    # Fetch all boards from the database
    boards = get_all_boards()
    return {"message": "Welcome to the FastAPI example! Go to the Readme to see the possible commands"}