from pydantic import BaseModel

# Base schemas (common fields)
class BoardBase(BaseModel):
    arrangement: str
    difficulty: int

# Schemas for creating new entities
class BoardCreate(BoardBase):
    pass 

# Schemas for returning entities
class Board(BoardBase):
    id: int

    class Config:
        from_attributes = True
    
