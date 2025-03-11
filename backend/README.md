1. navigate to the backend folder

2. uvicorn app.main:app --reload

3. navigate to http://127.0.0.1:8000/ 

##  TESTING COMMANDS IN BROWSER

once the server is running, to put a board into the database, you can go to the terminal and run the command

curl -X POST "http://localhost:8000/add-board/" -H "Content-Type: application/json" -d '{"arrangement": "INSERT ARRANGEMENT", "difficulty": INSERT DIFFICULTY}'

## ENDPOINT COMMANDS

/board/

PUT : /add/
GET : /generate/{difficulty}

/user/

PUT : /register/
GET : /search/{username}

### ENDPOINT TEST FILE

the test file tests all existing end points and can be run by

1. navigating to the backend folder
2. running python3 Tests/endpoint_test.py


uvicorn app.main:app --reload