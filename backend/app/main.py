from fastapi import FastAPI
from app.routers import board_router

app = FastAPI()

# Include the boards router
app.include_router(board_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI example!"}