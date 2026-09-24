"""
Weather Service
===============
Integrates with Open-Meteo (free, no API key required) for current
weather and 7-day forecast, plus generates agriculture-specific advisories.
"""

import logging
from typing import Optional
from datetime import datetime

import httpx

logger = logging.getLogger(__name__)

# Open-Meteo is a free, open-source weather API — no key required.
OPEN_METEO_BASE = "https://api.open-meteo.com/v1"
GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1"

# Pre-configured coordinates for Indian state capitals (fallback)
STATE_COORDS: dict[str, tuple[float, float]] = {
    "andhra pradesh": (15.9129, 79.7400),
    "arunachal pradesh": (27.1004, 93.6166),
    "assam": (26.2006, 92.9376),
    "bihar": (25.0961, 85.3131),
    "chhattisgarh": (21.2787, 81.8661),
    "goa": (15.2993, 74.1240),
    "gujarat": (22.2587, 71.1924),
    "haryana": (29.0588, 76.0856),
    "himachal pradesh": (31.1048, 77.1734),
    "jharkhand": (23.6102, 85.2799),
    "karnataka": (15.3173, 75.7139),
    "kerala": (10.8505, 76.2711),
    "madhya pradesh": (22.9734, 78.6569),
    "maharashtra": (19.7515, 75.7139),
    "manipur": (24.6637, 93.9063),
    "meghalaya": (25.4670, 91.3662),
    "mizoram": (23.1645, 92.9376),
    "nagaland": (26.1584, 94.5624),
    "odisha": (20.9517, 85.0985),
    "punjab": (31.1471, 75.3412),
    "rajasthan": (27.0238, 74.2179),
    "sikkim": (27.5330, 88.5122),
    "tamil nadu": (11.1271, 78.6569),
    "telangana": (18.1124, 79.0193),
    "tripura": (23.9408, 91.9882),
    "uttar pradesh": (26.8467, 80.9462),
    "uttarakhand": (30.0668, 79.0193),
    "west bengal": (22.9868, 87.8550),
    "delhi": (28.7041, 77.1025),
}


class WeatherService:
    """Fetches weather data from Open-Meteo and generates farm advisories."""

    def __init__(self):
        self.client = httpx.AsyncClient(timeout=15.0)

    async def _geocode(self, location: str) -> Optional[tuple[float, float]]:
        """Resolve a location name to lat/lon via Open-Meteo Geocoding."""
        try:
            resp = await self.client.get(
                f"{GEOCODING_BASE}/search",
                params={"name": location, "count": 1, "language": "en", "format": "json"},
            )
            resp.raise_for_status()
            data = resp.json()
            if data.get("results"):
                r = data["results"][0]
                return (r["latitude"], r["longitude"])
        except Exception as e:
            logger.warning(f"Geocoding failed for '{location}': {e}")
        return None

    async def _resolve_coords(
        self, lat: Optional[float], lon: Optional[float], state: Optional[str], district: Optional[str]
    ) -> tuple[float, float]:
        """Resolve coordinates from lat/lon or state/district name."""
        if lat is not None and lon is not None:
            return (lat, lon)

        # Try geocoding district + state
        search_query = f"{district}, {state}, India" if district else f"{state}, India"
        coords = await self._geocode(search_query)
        if coords:
            return coords

        # Fallback to state capital coords
        if state:
            key = state.lower().strip()
            if key in STATE_COORDS:
                return STATE_COORDS[key]

        # Ultimate fallback: New Delhi
        return (28.6139, 77.2090)

    async def get_current_and_forecast(
        self,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        state: Optional[str] = None,
        district: Optional[str] = None,
    ) -> dict:
        """
        Fetch current weather and 7-day forecast from Open-Meteo.
        """
        latitude, longitude = await self._resolve_coords(lat, lon, state, district)

        try:
            resp = await self.client.get(
                f"{OPEN_METEO_BASE}/forecast",
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index",
                    "daily": "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,rain_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max",
                    "timezone": "Asia/Kolkata",
                    "forecast_days": 7,
                },
            )
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            logger.error(f"Open-Meteo API failed: {e}")
            return {"error": str(e), "status": "api_error"}

        # Parse current weather
        current = data.get("current", {})
        current_weather = {
            "temperature_c": current.get("temperature_2m"),
            "feels_like_c": current.get("apparent_temperature"),
            "humidity_pct": current.get("relative_humidity_2m"),
            "precipitation_mm": current.get("precipitation"),
            "rain_mm": current.get("rain"),
            "wind_speed_kmh": current.get("wind_speed_10m"),
            "wind_direction_deg": current.get("wind_direction_10m"),
            "pressure_hpa": current.get("surface_pressure"),
            "uv_index": current.get("uv_index"),
            "weather_code": current.get("weather_code"),
            "description": self._weather_code_to_text(current.get("weather_code", 0)),
        }

        # Parse 7-day forecast
        daily = data.get("daily", {})
        forecast_days = []
        dates = daily.get("time", [])
        for i, date_str in enumerate(dates):
            forecast_days.append({
                "date": date_str,
                "temp_max_c": daily.get("temperature_2m_max", [None])[i] if i < len(daily.get("temperature_2m_max", [])) else None,
                "temp_min_c": daily.get("temperature_2m_min", [None])[i] if i < len(daily.get("temperature_2m_min", [])) else None,
                "precipitation_mm": daily.get("precipitation_sum", [0])[i] if i < len(daily.get("precipitation_sum", [])) else 0,
                "rain_mm": daily.get("rain_sum", [0])[i] if i < len(daily.get("rain_sum", [])) else 0,
                "rain_probability_pct": daily.get("precipitation_probability_max", [0])[i] if i < len(daily.get("precipitation_probability_max", [])) else 0,
                "wind_max_kmh": daily.get("wind_speed_10m_max", [0])[i] if i < len(daily.get("wind_speed_10m_max", [])) else 0,
                "uv_max": daily.get("uv_index_max", [0])[i] if i < len(daily.get("uv_index_max", [])) else 0,
                "weather_code": daily.get("weather_code", [0])[i] if i < len(daily.get("weather_code", [])) else 0,
                "description": self._weather_code_to_text(daily.get("weather_code", [0])[i]) if i < len(daily.get("weather_code", [])) else "Unknown",
            })

        # Generate farm advisory
        advisory = self._generate_farm_advisory(current_weather, forecast_days)

        return {
            "status": "success",
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "state": state,
                "district": district,
            },
            "current": current_weather,
            "forecast": forecast_days,
            "advisory": advisory,
            "data_source": "Open-Meteo",
            "timestamp": datetime.utcnow().isoformat(),
        }

    def _generate_farm_advisory(self, current: dict, forecast: list) -> list[str]:
        """Generate actionable farming advice based on weather data."""
        advisories = []
        temp = current.get("temperature_c")
        humidity = current.get("humidity_pct")
        rain = current.get("rain_mm", 0)
        uv = current.get("uv_index", 0)

        # Temperature advisories
        if temp is not None:
            if temp > 42:
                advisories.append("🔴 Extreme heat alert! Avoid fieldwork between 11AM-3PM. Provide shade to nurseries and increase irrigation frequency.")
            elif temp > 38:
                advisories.append("🟠 High temperature. Apply mulching to conserve soil moisture. Consider evening irrigation.")
            elif temp < 5:
                advisories.append("🔵 Frost risk! Cover sensitive crops with straw or plastic sheets overnight.")

        # Humidity advisories
        if humidity is not None:
            if humidity > 85:
                advisories.append("🟡 High humidity increases fungal disease risk. Monitor for leaf blight, rust, and mildew. Avoid overhead irrigation.")
            elif humidity < 30:
                advisories.append("🟡 Very low humidity. Increase irrigation frequency and consider windbreaks.")

        # Rain advisories from forecast
        total_rain_next_3d = sum(d.get("rain_mm", 0) for d in forecast[:3])
        if total_rain_next_3d > 50:
            advisories.append("🌧️ Heavy rainfall expected in the next 3 days. Postpone fertilizer/pesticide application. Ensure field drainage is clear.")
        elif total_rain_next_3d > 20:
            advisories.append("🌦️ Moderate rain expected. Good time for transplanting if planned. Delay spraying operations.")
        elif total_rain_next_3d < 2 and rain == 0:
            advisories.append("☀️ Dry spell expected. Ensure irrigation schedules are maintained. Consider drip irrigation to conserve water.")

        # UV advisory
        if uv is not None and uv > 8:
            advisories.append("☀️ Very high UV index. Protect yourself with a hat and sunscreen during fieldwork.")

        # Wind advisory
        max_wind = max((d.get("wind_max_kmh", 0) for d in forecast[:3]), default=0)
        if max_wind > 40:
            advisories.append("💨 Strong winds expected. Secure protective structures and stake tall crops.")

        if not advisories:
            advisories.append("✅ Weather conditions are favorable for normal farming operations.")

        return advisories

    @staticmethod
    def _weather_code_to_text(code: int) -> str:
        """Convert WMO weather interpretation code to human-readable text."""
        WMO_CODES = {
            0: "Clear sky",
            1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Foggy", 48: "Depositing rime fog",
            51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
            61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
            66: "Light freezing rain", 67: "Heavy freezing rain",
            71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
            77: "Snow grains",
            80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
            85: "Slight snow showers", 86: "Heavy snow showers",
            95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
        }
        return WMO_CODES.get(code, f"Code {code}")

    async def close(self):
        await self.client.aclose()


# Singleton
_weather_service: Optional[WeatherService] = None

def get_weather_service() -> WeatherService:
    global _weather_service
    if _weather_service is None:
        _weather_service = WeatherService()
    return _weather_service
