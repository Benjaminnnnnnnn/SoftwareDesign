from app.database import get_db_connection, initialize_db

def create_board(board: dict): #Tested
    """ CREATE: Creates and stores the given board in the 'boards' table """
    initialize_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO boards (arrangement, difficulty) VALUES (?, ?)",
        (board['arrangement'], board['difficulty'])
    )
    conn.commit()
    conn.close()
    return True

def read_board(id: int):
    """ READ: Retrieves board from the database with the given ID """
    conn = get_db_connection()
    try:
        cursor = conn.cursor() 
        cursor.execute(
            "SELECT * FROM boards WHERE id = ?", 
            (id,)
        )
        board = cursor.fetchone() 
        return board
    finally:
        cursor.close()

def update_board():
    # TODO: implement
    return

def delete_board(id: int):
    """ DELETE: Deletes a board from the database based on the given id """
    initialize_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM boards WHERE id = ?", (id,)
    )
    conn.commit()
    conn.close()
    return


def fetch_board(difficulty: int): #Tested, randomization works
    """ Retrieves a random board from the database with the specified difficulty """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Start with the requested difficulty and decrease until a board is found
    while difficulty >= 1:
        cursor.execute(
            "SELECT * FROM boards WHERE difficulty = ? ORDER BY RANDOM() LIMIT 1",
            (difficulty,)
        )
        board = cursor.fetchone()
        if board:
            conn.close()
            return board
        difficulty -= 1  # Decrease difficulty and try again

    conn.close()
    return None  # No boards found at any difficulty level

def get_all_boards(): #Created for testing purposes, can be deleted if not needed
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM boards")
    boards = cursor.fetchall()
    conn.close()
    return boards