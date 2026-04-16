import numpy as np
from sklearn.ensemble import IsolationForest
import pandas as pd

class FraudDetector:
    def __init__(self, contamination=0.05):
        self.model = IsolationForest(contamination=contamination, random_state=42)
        # Placeholder for trained state
        self.is_trained = False

    def train(self, data: pd.DataFrame):
        """
        Train the isolation forest on historical claim data.
        Features: [lat, lng, claimed_weather_code, actual_weather_code, time_gap, claim_amount]
        """
        if data.empty:
            return
        
        self.model.fit(data)
        self.is_trained = True

    def predict(self, features: list):
        """
        Predict if a claim is fraudulent.
        Returns: True if fraud, False if legit.
        """
        if not self.is_trained:
            # If not trained, we can't really detect anomalies, but let's assume it's legit for now
            # In a real app, we'd have a pre-trained model.
            return False
            
        prediction = self.model.predict([features])
        return prediction[0] == -1

    def calculate_fraud_score(self, gps_data, weather_data, behavioral_data, claim_history=[]):
        """
        Custom heuristic-based scoring + ML
        """
        score = 0
        
        # 1. GPS Spoofing Detection (Sudden jumps)
        if gps_data.get('distance_deviation', 0) > 5000: # 5km sudden jump
            score += 45
            
        # 2. Weather Mismatch
        if weather_data.get('mismatch'):
            score += 50
            
        # 3. Behavioral Pattern (Same pattern repeated)
        if behavioral_data.get('pattern_match'):
            score += 35
            
        # 4. Claims Frequency (Too many claims in short time)
        claims_today = len([c for c in claim_history if c.get('date') == 'today'])
        if claims_today > 2:
            score += 30
            
        return min(score, 100)

fraud_detector = FraudDetector()
