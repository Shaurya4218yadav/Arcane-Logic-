import asyncio
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app import crud, models
from app.services import event_engine, fraud as fraud_svc, payments, earnings_engine

logger = logging.getLogger("vayuguard")

async def run_background_orchestrator():
    """
    Background listener that continuously monitors active policies,
    checks for valid triggers (weather disruption), and initiates auto-payouts.
    """
    await asyncio.sleep(5) # Delay start
    while True:
        try:
            logger.info("Background Orchestrator: Checking active policies for auto-payouts...")
            db = SessionLocal()
            now = datetime.utcnow()
            
            # Find all users with active policies that have passed the cooling period
            active_policies = db.query(models.Policy).filter(
                models.Policy.status == "ACTIVE",
                models.Policy.activation_date <= now
            ).all()

            for policy in active_policies:
                user = db.query(models.User).filter(models.User.id == policy.user_id).first()
                if not user:
                    continue
                
                # Check for triggers based on user's default zone
                lat, lon = 13.0067, 80.2206 # Default to Adyar coords
                event_result = event_engine.evaluate_event(lat, lon, "flood")
                
                if event_result["triggered"]:
                    # Auto-calculate payout
                    earnings_data = earnings_engine.get_earnings_dashboard("Adyar", "flood")
                    payout = earnings_data["gap_covered"]
                    
                    if payout > 0:
                        # Process zero-touch auto payout logic here
                        logger.info(f"Auto-Payout Triggered for User {user.id} -> Payout: ₹{payout}")
                        # In production: payments.process_payout(db, claim_id, payout)
            
            db.close()
        except Exception as e:
            logger.error(f"Background orchestrator error: {e}")
            
        await asyncio.sleep(3600)  # Sleep for an hour
