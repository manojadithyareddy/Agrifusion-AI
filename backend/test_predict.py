import asyncio
import sys
from app.services.prediction import get_prediction_service

async def test_all():
    service = get_prediction_service()

    print("Testing Crop Recommendation...")
    try:
        res1 = await service.get_crop_recommendation(location="Maharashtra", soilType="Black", season="Kharif")
        print("Crop:", res1.keys())
    except Exception as e:
        print("Crop failed:", e)

    print("Testing Yield...")
    try:
        res2 = await service.get_yield_prediction(crop="Cotton", state="Maharashtra", season="Kharif", area_hectares=2.5)
        print("Yield:", res2.keys())
    except Exception as e:
        print("Yield failed:", e)

    print("Testing Climate Risk...")
    try:
        res3 = await service.get_climate_risk(state="Maharashtra", crop="Cotton")
        print("Climate:", res3.keys())
    except Exception as e:
        print("Climate failed:", e)

    print("Testing Irrigation...")
    try:
        res4 = await service.get_irrigation_advice(crop="Cotton", temperature=30.0, humidity=50.0, recent_rainfall_mm=10.0)
        print("Irrigation:", res4.keys())
    except Exception as e:
        print("Irrigation failed:", e)

    print("Testing Market Price...")
    try:
        res5 = await service.get_market_price(crop="Cotton", state="Maharashtra")
        print("Market:", res5.keys())
    except Exception as e:
        print("Market failed:", e)

    print("Testing Revenue Profit...")
    try:
        res6 = await service.get_revenue_profit(crop="Cotton", area_hectares=2.5, predicted_yield_kg_per_hectare=1000, predicted_price_per_quintal=6000)
        print("Revenue:", res6.keys())
    except Exception as e:
        print("Revenue failed:", e)


if __name__ == "__main__":
    asyncio.run(test_all())
