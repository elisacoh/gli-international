from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PaymentCreate(BaseModel):
    formation_id: str
    amount: float = Field(..., gt=0)
    currency: str = "GEL"


class PaymentResponse(BaseModel):
    id: str
    user_id: str
    formation_id: str
    amount: float
    currency: str
    status: str  # pending, completed, failed, refunded
    payment_method: str
    transaction_id: Optional[str] = None
    payment_url: Optional[str] = None  # URL to redirect user for payment
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaymentCallbackData(BaseModel):
    """
    Data received from Bank of Georgia payment callback
    Structure depends on BOG API documentation
    """
    transaction_id: str
    status: str
    amount: float
    currency: str
    signature: Optional[str] = None
