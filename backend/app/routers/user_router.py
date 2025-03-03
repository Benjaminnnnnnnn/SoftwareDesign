from fastapi import APIRouter, Depends, HTTPException

from app.schemas.user_schema import User, UserCreate
from app.crud.user_crud import create_user, search_user, read_user

router = APIRouter(prefix = "/user", tags = ["user"])

@router.post("/register/")
def register_user(user: UserCreate):
    """ 
    Requires : User passed in through the body of the request as a JSON object
    Function : Creates a user for the given details
    Returns : True if the user was successfully created, False if not
    """
    username = user.username  # Access the username attribute directly
    if not check_user(username):
        create_user(user.dict())  # Convert the Pydantic model to a dictionary
        return True
    else:
        return False


# Endpoint to check if a user exists for the given username
@router.get("/search/{username}/")
def check_user(username: str):
    """
    Requires: Takes in "username" as a parameter
    Returns: "True" if a user under the given username exists
    """
    exists = search_user(username)
    # returns True if a user with the given username exists
    return exists

@router.get("/login/")
def login_user(username: str, password: str):
    # TODO: implement
    return



