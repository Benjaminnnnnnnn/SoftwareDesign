import sqlite3

DATABASE_PATH = "game_data.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row # returns rows as dictionaries and allows for more readable indexing
    return conn

def initialize_db():
    """Initialize the database by creating tables if they don't exist"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS boards (
                   id integer PRIMARY KEY AUTOINCREMENT
                   arrangement string NOT NULL UNIQUE,
                   difficulty integer NOT NULL)
    """)
    # TODO : CREATE TABLES FOR USERS AND OTHER THIGNS TO BE STORED (create crud operations and routers as well)
    conn.commit()
    conn.close()