from app import crud


def process_payout(db, claim_id: int, amount: float):
    """Simulate a payout. Marks claim paid and returns a result dict."""
    # In real system call a payment gateway here. We simulate success.
    c = crud.mark_claim_paid(db, claim_id)
    if not c:
        return {"success": False, "reason": "claim_not_found"}
    return {"success": True, "claim_id": claim_id, "amount": amount}
