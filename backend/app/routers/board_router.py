from fastapi import APIRouter, Depends, HTTPException

from app.schemas.board_schema import Board, BoardCreate
from app.crud.board_crud import create_board, get_board

router = APIRouter(prefix = "/boards", tags = ["boards"])

#Endpoint to store a board
@router.post("/", response_model = Board)
def store_board(board: BoardCreate):
    """
    Store a new board in the database
    """
    board_id = create_board(board.dict())

#Endpoint to get a random board by difficulty (using a path parameter)
@router.get("/pull/{difficulty}/", response_model=Board)
def get_board(difficulty: int):
    """
    Pull a random board from the database of a given difficulty
    """
    board = get_board(difficulty)
    return board