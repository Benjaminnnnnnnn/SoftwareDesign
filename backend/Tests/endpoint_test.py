import sys
import os

# Add the 'backend' directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app  # Import your FastAPI app
from app.database import initialize_db
from fastapi.testclient import TestClient
import pytest
import httpx

client = TestClient(app)

# Initialize the database before running tests
@pytest.fixture(autouse=True)
def setup_database():
    initialize_db()
    yield  # Run the tests

# Create test data
test_board = {
    "difficulty": 1,
    "arrangement": "some_arrangement_string"
}

test_user = {
    "username": "testuser",
    "password": "testpassword"
}

# Test for storing board arrangement
def test_store_board():
    response = client.post("/board/add/", json=test_board)
    assert response.status_code == 200
    
    # Check that the response is {"success": True}
    assert response.json() == {"success": True}

# Test for getting a random board by difficulty
def test_get_board():
    difficulty = 1
    response = client.get(f"/board/generate/{difficulty}/")
    assert response.status_code == 200
    assert isinstance(response.json(), str)

# Test for registering a user
def test_register_user():
    response = client.post("/user/register/", json=test_user)
    assert response.status_code == 200
    assert (response.json() is True) or (response.json() is False)
    # The response returns false if the username attempted to register already exists in the database

# Test for checking if a user exists
def test_check_user():
    username = "testuser"
    response = client.get(f"/user/search/{username}/")
    assert response.status_code == 200
    assert (response.json() is True)

# Test for user login (TODO: implement)
def test_login_user():
    username = "testuser"
    password = "testpassword"
    response = client.get("/user/login/", params={"username": username, "password": password})
    assert response.status_code == 200
    # Add more assertions based on your implementation

# Run the tests
if __name__ == "__main__":
    pytest.main()