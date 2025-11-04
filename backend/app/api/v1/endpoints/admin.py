from fastapi import APIRouter, HTTPException, Query
from typing import List

router = APIRouter()


@router.get("/users")
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """
    List all users (Admin only)
    """
    # TODO: Implement list users with admin check
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, role: str):
    """
    Update a user's role (Admin only)
    """
    # TODO: Implement update user role with admin check
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/formations/stats")
async def get_formation_stats():
    """
    Get formation statistics (Admin only)
    """
    # TODO: Implement formation stats with admin check
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/enrollments")
async def list_enrollments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """
    List all enrollments (Admin only)
    """
    # TODO: Implement list enrollments with admin check
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/payments")
async def list_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """
    List all payments (Admin only)
    """
    # TODO: Implement list payments with admin check
    raise HTTPException(status_code=501, detail="Not implemented yet")
