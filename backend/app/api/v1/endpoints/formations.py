from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.formation import FormationResponse, FormationCreate, FormationUpdate

router = APIRouter()


@router.get("/", response_model=List[FormationResponse])
async def get_formations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    level: Optional[str] = None,
    locale: str = Query("fr", regex="^(fr|en|ka)$"),
):
    """
    Get list of formations with filtering and pagination
    """
    # TODO: Implement get formations
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/{formation_id}", response_model=FormationResponse)
async def get_formation(formation_id: str, locale: str = Query("fr")):
    """Get a single formation by ID"""
    # TODO: Implement get formation by ID
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/", response_model=FormationResponse)
async def create_formation(formation_data: FormationCreate):
    """
    Create a new formation (Admin only)
    """
    # TODO: Implement create formation with admin check
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.put("/{formation_id}", response_model=FormationResponse)
async def update_formation(formation_id: str, formation_data: FormationUpdate):
    """
    Update a formation (Admin only)
    """
    # TODO: Implement update formation with admin check
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.delete("/{formation_id}")
async def delete_formation(formation_id: str):
    """
    Delete a formation (Admin only)
    """
    # TODO: Implement delete formation with admin check
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/{formation_id}/enroll")
async def enroll_in_formation(formation_id: str):
    """
    Enroll current user in a formation
    """
    # TODO: Implement enrollment
    raise HTTPException(status_code=501, detail="Not implemented yet")
