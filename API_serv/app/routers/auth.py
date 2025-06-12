from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

fake_users = {}

class AuthRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(auth: AuthRequest):
    if auth.username in fake_users:
        raise HTTPException(status_code=400, detail="Username already exists")
    fake_users[auth.username] = auth.password
    return {"token": f"fake-token-for-{auth.username}"}

@router.post("/login")
def login(auth: AuthRequest):
    if fake_users.get(auth.username) != auth.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": f"fake-token-for-{auth.username}"}
