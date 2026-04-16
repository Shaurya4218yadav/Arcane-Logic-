import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "mock_key")

class WeatherService:
    @staticmethod
    def get_historical_weather(lat, lon, timestamp):
        """
        In a real scenario, use OpenWeatherMap Time Machine API
        For this simulation, we mock the response.
        """
        if OPENWEATHER_API_KEY == "mock_key":
            # Mock Logic: if timestamp ends in even digit, say 'Rain'
            return "Rain" if int(str(timestamp)[-1]) % 2 == 0 else "Clear"
            
        # Real API call (commented out for safety/cost)
        # url = f"https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={timestamp}&appid={OPENWEATHER_API_KEY}"
        # response = requests.get(url)
        # data = response.json()
        # return data['weather'][0]['main']
        
        return "Clear"

    @staticmethod
    def check_mismatch(claimed_weather, lat, lon, timestamp):
        actual = WeatherService.get_historical_weather(lat, lon, timestamp)
        return {
            "actual": actual,
            "mismatch": claimed_weather.lower() != actual.lower(),
            "confidence": 0.95
        }

weather_service = WeatherService()
