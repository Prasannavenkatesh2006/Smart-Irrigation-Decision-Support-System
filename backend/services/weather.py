"""
Service: Weather Data Provider
Handles weather data retrieval (mock for demonstration or real API)
"""

from typing import Dict, Optional
from datetime import datetime, timedelta
import random
import logging
import os
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class WeatherService:
    """Provides weather data for irrigation decisions"""
    
    def __init__(self, use_mock: bool = False, api_provider: str = "openweathermap"):
        """
        Initialize weather service
        
        Args:
            use_mock: DEPRECATED - Always False. API key is required.
            api_provider: "openweathermap" or "weatherapi"
        """
        self.use_mock = False  # Always require real API
        self.api_provider = api_provider.lower()
        self.api_key = os.getenv("WEATHER_API_KEY") or os.getenv("OPENWEATHER_API_KEY")
        
        if not self.api_key:
            logger.warning(
                "⚠️ Weather API key not found! "
                "Please set WEATHER_API_KEY or OPENWEATHER_API_KEY in .env file. "
                "System will use fallback data. "
                "Get your API key from: "
                "https://openweathermap.org/api (for OpenWeatherMap) or "
                "https://www.weatherapi.com/ (for WeatherAPI)"
            )
            # Don't raise error, allow system to start with warnings
        else:
            logger.info(f"✅ Weather service initialized with {self.api_provider} API")
    
    def get_forecast(self, location: Optional[str] = None, days: int = 1) -> Dict:
        """
        Get weather forecast from real API
        
        Args:
            location: Location identifier (lat/lon, city name, or zip code)
            days: Number of days to forecast (max 7 for most APIs)
            
        Returns:
            Dict with forecast data
            
        Raises:
            ValueError: If API key is missing and fallback fails
            requests.RequestException: If API request fails
        """
        if not self.api_key:
            logger.warning("Weather API key not configured. Using fallback forecast data.")
            return self._get_fallback_forecast(location, days)
        
        try:
            if self.api_provider == "weatherapi":
                return self._get_weatherapi_forecast(location, days)
            else:  # Default to OpenWeatherMap
                return self._get_openweather_forecast(location, days)
        except requests.exceptions.RequestException as e:
            logger.error(f"Weather API request failed: {e}. Using fallback data.")
            return self._get_fallback_forecast(location, days)
        except Exception as e:
            logger.error(f"Unexpected error fetching weather: {e}. Using fallback data.")
            return self._get_fallback_forecast(location, days)
    
    def _get_fallback_forecast(self, days: int = 1, location: Optional[str] = None) -> Dict:
        """Generate fallback weather data when API is unavailable"""
        
        forecasts = []
        
        for i in range(days):
            date = datetime.now() + timedelta(days=i)
            
            # Generate realistic weather patterns
            rainfall = self._generate_rainfall()
            temp = random.uniform(20, 35)  # Celsius
            humidity = random.uniform(40, 90)  # Percentage
            
            forecasts.append({
                "date": date.strftime("%Y-%m-%d"),
                "rainfall_mm": round(rainfall, 1),
                "temperature_c": round(temp, 1),
                "humidity_percent": round(humidity, 1),
                "conditions": self._get_conditions(rainfall)
            })
        
        return {
            "source": "fallback_weather_service",
            "forecasts": forecasts,
            "location": location or "Demo Location",
            "note": "Using fallback data. Configure weather API key for real forecasts."
        }
    
    def _generate_rainfall(self) -> float:
        """Generate realistic rainfall amounts"""
        # 70% chance of no rain, 30% chance of rain
        if random.random() > 0.3:
            return 0.0
        
        # If raining, generate amount
        # Light rain: 0-5mm (60%)
        # Moderate rain: 5-15mm (30%)
        # Heavy rain: 15-50mm (10%)
        rand = random.random()
        
        if rand < 0.6:
            return random.uniform(0.1, 5.0)
        elif rand < 0.9:
            return random.uniform(5.0, 15.0)
        else:
            return random.uniform(15.0, 50.0)
    
    def _get_conditions(self, rainfall: float) -> str:
        """Get weather conditions based on rainfall"""
        if rainfall == 0:
            return "Clear"
        elif rainfall < 2:
            return "Light Rain"
        elif rainfall < 10:
            return "Moderate Rain"
        elif rainfall < 20:
            return "Heavy Rain"
        else:
            return "Very Heavy Rain"
    
    def get_rainfall_prediction(self, location: Optional[str] = None) -> float:
        """
        Get 24-hour rainfall prediction
        
        Returns:
            float: Expected rainfall in mm
        """
        forecast = self.get_forecast(location, days=1)
        
        if forecast and forecast["forecasts"]:
            return forecast["forecasts"][0]["rainfall_mm"]
        
        return 0.0
    
    def should_skip_irrigation(self, rainfall_mm: float, threshold: float = 10.0) -> bool:
        """
        Determine if irrigation should be skipped based on rainfall
        
        Args:
            rainfall_mm: Predicted rainfall amount
            threshold: Rainfall threshold for skipping irrigation
            
        Returns:
            bool: True if should skip irrigation
        """
        return rainfall_mm >= threshold
    
    def get_weekly_weather_summary(self, location: Optional[str] = None) -> Dict:
        """Get a 7-day weather summary"""
        forecast = self.get_forecast(location, days=7)
        
        if not forecast or not forecast["forecasts"]:
            return {"error": "No forecast data available"}
        
        total_rainfall = sum(day["rainfall_mm"] for day in forecast["forecasts"])
        avg_temp = sum(day["temperature_c"] for day in forecast["forecasts"]) / len(forecast["forecasts"])
        rainy_days = sum(1 for day in forecast["forecasts"] if day["rainfall_mm"] > 2)
        
        return {
            "period": "7 days",
            "total_rainfall_mm": round(total_rainfall, 1),
            "average_temperature_c": round(avg_temp, 1),
            "rainy_days": rainy_days,
            "forecasts": forecast["forecasts"]
        }
    
    def _get_openweather_forecast(self, location: Optional[str], days: int) -> Dict:
        """
        Get forecast from OpenWeatherMap API
        
        Args:
            location: City name, state code, country code (e.g., "London,uk")
            days: Number of days (max 5 for free tier)
            
        Returns:
            Dict with forecast data
        """
        if not self.api_key:
            raise ValueError("OpenWeatherMap API key not configured")
        
        # Limit days for free tier
        days = min(days, 5)
        
        # Default location if not provided
        if not location:
            location = "London,uk"  # Default fallback
        
        url = "https://api.openweathermap.org/data/2.5/forecast"
        params = {
            "q": location,
            "appid": self.api_key,
            "units": "metric"  # Celsius
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            forecasts = []
            forecast_list = data.get("list", [])
            
            # Group by day and get daily summary
            current_date = None
            daily_data = {}
            
            for item in forecast_list[:days * 8]:  # 8 forecasts per day (3-hour intervals)
                dt = datetime.fromtimestamp(item["dt"])
                date_str = dt.strftime("%Y-%m-%d")
                
                if date_str != current_date:
                    if current_date and daily_data:
                        # Calculate daily totals
                        forecasts.append({
                            "date": current_date,
                            "rainfall_mm": daily_data.get("rain", 0),
                            "temperature_c": daily_data.get("temp_avg", daily_data.get("temp", 0)),
                            "humidity_percent": daily_data.get("humidity_avg", daily_data.get("humidity", 0)),
                            "conditions": daily_data.get("conditions", "Clear")
                        })
                    
                    current_date = date_str
                    daily_data = {
                        "temp_sum": 0,
                        "temp_count": 0,
                        "humidity_sum": 0,
                        "humidity_count": 0,
                        "rain": 0,
                        "conditions": item["weather"][0]["main"] if item.get("weather") else "Clear"
                    }
                
                # Accumulate data
                daily_data["temp_sum"] += item["main"]["temp"]
                daily_data["temp_count"] += 1
                daily_data["humidity_sum"] += item["main"]["humidity"]
                daily_data["humidity_count"] += 1
                
                # Rain data (3h forecast)
                if "rain" in item:
                    daily_data["rain"] += item["rain"].get("3h", 0)
                
                daily_data["temp_avg"] = daily_data["temp_sum"] / daily_data["temp_count"]
                daily_data["humidity_avg"] = daily_data["humidity_sum"] / daily_data["humidity_count"]
            
            # Add last day
            if current_date and daily_data:
                forecasts.append({
                    "date": current_date,
                    "rainfall_mm": round(daily_data.get("rain", 0), 1),
                    "temperature_c": round(daily_data.get("temp_avg", 0), 1),
                    "humidity_percent": round(daily_data.get("humidity_avg", 0), 1),
                    "conditions": self._get_conditions(daily_data.get("rain", 0))
                })
            
            return {
                "source": "openweathermap",
                "forecasts": forecasts[:days],
                "location": location
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"OpenWeatherMap API error: {e}")
            raise
    
    def _get_weatherapi_forecast(self, location: Optional[str], days: int) -> Dict:
        """
        Get forecast from WeatherAPI.com
        
        Args:
            location: City name, lat,lon, or IP address
            days: Number of days (max 3 for free tier, 14 for paid)
            
        Returns:
            Dict with forecast data
        """
        if not self.api_key:
            raise ValueError("WeatherAPI key not configured")
        
        # Limit days for free tier
        days = min(days, 3)
        
        # Default location if not provided
        if not location:
            location = "London"  # Default fallback
        
        url = "https://api.weatherapi.com/v1/forecast.json"
        params = {
            "key": self.api_key,
            "q": location,
            "days": days,
            "aqi": "no",
            "alerts": "no"
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            forecasts = []
            forecast_days = data.get("forecast", {}).get("forecastday", [])
            
            for day_data in forecast_days:
                date = day_data["date"]
                day_info = day_data["day"]
                hour_data = day_data.get("hour", [])
                
                # Calculate average temperature from hourly data
                if hour_data:
                    temps = [h["temp_c"] for h in hour_data]
                    avg_temp = sum(temps) / len(temps)
                else:
                    avg_temp = day_info.get("avgtemp_c", day_info.get("maxtemp_c", 0))
                
                # Get total rainfall
                total_rain = day_info.get("totalprecip_mm", 0)
                
                # Get conditions
                condition = day_info.get("condition", {}).get("text", "Clear")
                
                forecasts.append({
                    "date": date,
                    "rainfall_mm": round(total_rain, 1),
                    "temperature_c": round(avg_temp, 1),
                    "humidity_percent": round(day_info.get("avghumidity", 0), 1),
                    "conditions": condition
                })
            
            return {
                "source": "weatherapi",
                "forecasts": forecasts,
                "location": data.get("location", {}).get("name", location)
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"WeatherAPI error: {e}")
            raise
