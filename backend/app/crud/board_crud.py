from app.database import get_db_connection

def create_board(board: dict):
    # Stores the given board in the database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute
    board_id = cursor.lastrowid() # return the id of the newly inserted item incase we need it
    conn.close()
    return board_id

def get_board(difficulty: int):
    # Retrieves a random board of the given difficulty
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