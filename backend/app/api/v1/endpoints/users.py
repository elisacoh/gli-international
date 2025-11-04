from fastapi import APIRouter, HTTPException
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def get_user_profile():
    """Get current user's profile"""
    # TODO: Implement get user profile
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.put("/profile", response_model=UserResponse)
async def update_user_profile(user_data: UserUpdate):
    """Update current user's profile"""
    # TODO: Implement update user profile
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/enrollments")
async def get_user_enrollments():
    """Get current user's enrollments"""
    # TODO: Implement get enrollments
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/payments")
async def get_user_payments():
    """Get current user's payment history"""
    # TODO: Implement get payment history
    raise HTTPException(status_code=501, detail="Not implemented yet")
