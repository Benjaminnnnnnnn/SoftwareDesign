import sqlite3

DATABASE_PATH = "game.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    return conn

def initialize_db():
    """Initialize the database by creating tables if they don't exist"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS boards (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   arrangement STRING,
                   difficulty INTEGER)
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   username STRING,
                   password STRING
                   current_arrangement_id INTEGER) 
    """)
    # TODO : CREATE TABLES FOR USERS AND OTHER THIGNS TO BE STORED (create crud operations and routers as well)
    conn.commit()
    conn.close()