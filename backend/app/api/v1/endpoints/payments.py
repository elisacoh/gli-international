from fastapi import APIRouter, HTTPException, Request
from app.schemas.payment import PaymentCreate, PaymentResponse

router = APIRouter()


@router.post("/initiate", response_model=PaymentResponse)
async def initiate_payment(payment_data: PaymentCreate):
    """
    Initiate a payment with Bank of Georgia
    This will use OAuth2 or HTTP Basic Auth based on configuration
    """
    # TODO: Implement Bank of Georgia payment initiation
    # Steps:
    # 1. Authenticate with BOG API (OAuth2 or Basic Auth)
    # 2. Create payment order
    # 3. Return payment URL for user to complete payment
    raise HTTPException(status_code=501, detail="Payment integration not implemented yet")


@router.post("/callback")
async def payment_callback(request: Request):
    """
    Handle payment callback from Bank of Georgia
    This endpoint will be called by BOG when payment status changes
    """
    # TODO: Implement payment callback
    # Steps:
    # 1. Verify callback signature
    # 2. Update payment status in database
    # 3. Update enrollment status if payment successful
    # 4. Send confirmation email to user
    raise HTTPException(status_code=501, detail="Payment callback not implemented yet")


@router.get("/{payment_id}/status", response_model=PaymentResponse)
async def get_payment_status(payment_id: str):
    """
    Get payment status
    """
    # TODO: Implement get payment status
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/{payment_id}/verify")
async def verify_payment(payment_id: str):
    """
    Manually verify payment status with Bank of Georgia
    """
    # TODO: Implement payment verification
    raise HTTPException(status_code=501, detail="Not implemented yet")
