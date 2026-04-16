import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

class EarningsPredictor:
    def __init__(self):
        self.model = LinearRegression()
        self.is_trained = False

    def train(self, history: pd.DataFrame):
        """
        history: features like [day_of_week, rain_prob, active_hours]
        """
        if history.empty:
            return
            
        X = history[['day_of_week', 'rain_prob', 'active_hours']]
        y = history['earnings']
        self.model.fit(X, y)
        self.is_trained = True

    def predict_next_week(self, features):
        """
        features: [day_of_week, rain_prob, active_hours]
        """
        if not self.is_trained:
            # Mock prediction if no data
            return 4500.0 # Default weekly target
            
        prediction = self.model.predict([features])
        return float(prediction[0])

predictor = EarningsPredictor()
