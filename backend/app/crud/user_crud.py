from app.database import get_db_connection, initialize_db

def create_user(user: dict):
    """ CREATE: Creates and stores the given user in the 'users' table """
    initialize_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (user['username'], user['password'])
    )
    conn.commit()
    conn.close()
    return

def read_user(id: int):
    """ READ: Retrieves  from the database with the given ID """
    conn = get_db_connection()
    try:
        cursor = conn.cursor() 
        cursor.execute(
            "SELECT * FROM boards WHERE id = ?", 
            (id,)
        )
        user = cursor.fetchone() 
        return user
    finally:
        cursor.close()

def update_user():
    # TODO: implement update method
    return

def delete_user():
    # TODO: implement delete method
    return

def search_user(username: str):
    """ Searches for an existing user in the database with the given username
        Returns "True" if a user exists"""
    initialize_db()
    conn = get_db_connection()
    cursor = None
    try:
        cursor = conn.cursor()
        # Execute the query to check if the username exists
        cursor.execute(
            "SELECT 1 FROM users WHERE username = ?", 
            (username,)
        )
        # Fetch the result (if any)
        result = cursor.fetchone()
        # Return True if a user exists, otherwise False
        return result is not None
    except Exception as e:
        # Log the error (optional)
        print(f"An error occurred: {e}")
        return False
    finally:
        # Ensure the cursor and connection are closed
        if cursor:
            cursor.close()
        if conn:
            conn.close()


