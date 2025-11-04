from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime


class LocalizedContent(BaseModel):
    fr: str
    en: Optional[str] = None
    ka: Optional[str] = None


class FormationBase(BaseModel):
    title: LocalizedContent
    description: LocalizedContent
    short_description: LocalizedContent
    price: float = Field(..., ge=0)
    currency: str = "GEL"
    duration_hours: int = Field(..., gt=0)
    level: str = Field(..., regex="^(beginner|intermediate|advanced)$")
    category: str


class FormationCreate(FormationBase):
    image_url: Optional[str] = None
    video_url: Optional[str] = None


class FormationUpdate(BaseModel):
    title: Optional[LocalizedContent] = None
    description: Optional[LocalizedContent] = None
    short_description: Optional[LocalizedContent] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    duration_hours: Optional[int] = None
    level: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    is_published: Optional[bool] = None


class FormationResponse(FormationBase):
    id: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
