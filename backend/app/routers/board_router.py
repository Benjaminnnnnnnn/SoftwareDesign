from fastapi import APIRouter, Depends, HTTPException

from app.schemas.board_schema import Board, BoardCreate
from app.crud.board_crud import create_board, fetch_board

router = APIRouter(prefix = "/board", tags = ["board"])

# Endpoint to store a board
@router.post("/add/")
def store_board(board: BoardCreate):
    """
    Requires: Board passed in through the body of the request as a JSON object
    Function: Stores the given board into the SQL database
    Returns: True if the board was successfully stored
    """
    # Create the board in the database
    create_board(board.dict())
    
    # Return True to indicate success
    return {"success": True}

# Endpoint to get a random board by difficulty (using a path parameter)
@router.get("/generate/{difficulty}/")
def get_board(difficulty: int):
    """
    Requires: Takes in "difficulty" as a parameter, difficulty should be between 1 and 3 (max)
    Functionality: Pulls a random board from the database, of the given difficulty
    Returns: Arrangement string of the board that was pulled
    """
    board = fetch_board(difficulty)
    # returns the arrangement string for the board it pulled
    return board[0]

# TODO: Endpoint to pull a board based on the id