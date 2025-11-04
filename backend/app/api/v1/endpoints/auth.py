from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """
    Register a new user
    This will integrate with Supabase Auth
    """
    # TODO: Implement user registration
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """
    Login user and return access token
    This will validate Supabase Auth tokens
    """
    # TODO: Implement login
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/logout")
async def logout():
    """Logout user"""
    # TODO: Implement logout
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token():
    """Refresh access token"""
    # TODO: Implement token refresh
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """Get current authenticated user"""
    # TODO: Implement get current user
    raise HTTPException(status_code=501, detail="Not implemented yet")
