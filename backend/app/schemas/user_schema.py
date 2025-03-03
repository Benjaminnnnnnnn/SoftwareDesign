from pydantic import BaseModel

# Base schemas (common fields)
class UserBase(BaseModel):
    username: str
    password: str
    # TODO: add any other required fields

# Schemas for creating new entities
class UserCreate(UserBase):
    pass 

# Schemas for returning entities
class User(UserBase):
    id: int

    class Config:
        from_attributes = True