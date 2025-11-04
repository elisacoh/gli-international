"""
Bank of Georgia API Client

This module handles integration with Bank of Georgia payment API.
Supports both OAuth2 and HTTP Basic Authentication.

BOG API Documentation: [Add official BOG API docs URL here]
"""

import httpx
from typing import Optional, Dict, Any
from app.core.config import settings


class BankOfGeorgiaClient:
    """Client for Bank of Georgia payment API"""

    def __init__(self):
        self.api_url = settings.BOG_API_URL
        self.oauth_url = settings.BOG_OAUTH_URL
        self.client_id = settings.BOG_CLIENT_ID
        self.client_secret = settings.BOG_CLIENT_SECRET
        self.merchant_id = settings.BOG_MERCHANT_ID
        self.access_token: Optional[str] = None

    async def authenticate_oauth2(self) -> str:
        """
        Authenticate using OAuth2
        Returns access token
        """
        # TODO: Implement OAuth2 authentication
        # POST to oauth_url with client credentials
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.oauth_url,
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                },
            )
            response.raise_for_status()
            data = response.json()
            self.access_token = data.get("access_token")
            return self.access_token

    async def create_payment_order(
        self, amount: float, currency: str, order_id: str, callback_url: str
    ) -> Dict[str, Any]:
        """
        Create a payment order with Bank of Georgia

        Args:
            amount: Payment amount
            currency: Currency code (e.g., 'GEL')
            order_id: Unique order identifier
            callback_url: URL for payment status callbacks

        Returns:
            Dictionary containing payment_url and transaction_id
        """
        # TODO: Implement payment order creation
        # This will depend on BOG API specification

        if not self.access_token:
            await self.authenticate_oauth2()

        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {self.access_token}"}

            # Example payload - adjust based on BOG API docs
            payload = {
                "merchant_id": self.merchant_id,
                "amount": amount,
                "currency": currency,
                "order_id": order_id,
                "callback_url": callback_url,
                "success_url": f"{settings.NEXT_PUBLIC_APP_URL}/payment/success",
                "fail_url": f"{settings.NEXT_PUBLIC_APP_URL}/payment/failed",
            }

            response = await client.post(
                f"{self.api_url}/payments/create",
                json=payload,
                headers=headers,
            )
            response.raise_for_status()
            return response.json()

    async def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """
        Verify payment status with Bank of Georgia

        Args:
            transaction_id: Transaction identifier from BOG

        Returns:
            Payment status information
        """
        # TODO: Implement payment verification
        if not self.access_token:
            await self.authenticate_oauth2()

        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = await client.get(
                f"{self.api_url}/payments/{transaction_id}/status",
                headers=headers,
            )
            response.raise_for_status()
            return response.json()

    def verify_callback_signature(self, payload: Dict[str, Any], signature: str) -> bool:
        """
        Verify the signature of a payment callback

        Args:
            payload: Callback payload
            signature: Signature from BOG

        Returns:
            True if signature is valid
        """
        # TODO: Implement signature verification based on BOG specs
        # Usually involves HMAC-SHA256 with client secret
        import hmac
        import hashlib
        import json

        # Example implementation - adjust based on BOG API docs
        payload_string = json.dumps(payload, sort_keys=True)
        expected_signature = hmac.new(
            self.client_secret.encode(),
            payload_string.encode(),
            hashlib.sha256,
        ).hexdigest()

        return hmac.compare_digest(expected_signature, signature)
