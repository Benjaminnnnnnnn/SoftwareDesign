from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/earle")
async def earle():
    return {"message": "The Eagel has Landed"}

@app.get("/test/{num}")
async def test(num):
    return {"message": num}