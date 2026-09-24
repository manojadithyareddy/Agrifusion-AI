import requests

BASE = 'http://localhost:8000/api/v1'

def main():
    # 1. Login
    login_res = requests.post(f'{BASE}/auth/login', json={'email': 'dev@agrifusion.com', 'password': 'password123'})
    token = login_res.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print('Logged in successfully as dev@agrifusion.com')

    # 2. Test Crop Rec with village and targetCrop
    print('\n=== 1. CROP RECOMMENDATION HTTP TESTS ===')
    for loc, soil, season, target in [
        ('Athani, Belgaum, Karnataka', 'Black', 'Kharif', 'Cotton'),
        ('Jagraon, Ludhiana, Punjab', 'Alluvial', 'Rabi', 'Wheat'),
        ('Nokha, Bikaner, Rajasthan', 'Sandy', 'Kharif', 'Mothbeans'),
    ]:
        r = requests.post(f'{BASE}/predictions/crop-recommendation', json={'location': loc, 'soilType': soil, 'season': season, 'targetCrop': target}, headers=headers)
        data = r.json()
        crops = [(c['crop'], f"{int(c['suitability_score']*100)}%") for c in data['recommendations']]
        print(f'{loc} ({soil}, {season}) -> {crops}')
        target_assess = data.get('target_crop_assessment')
        if target_assess:
            print(f"  Target Crop '{target}' Risk: {target_assess['overall_risk_level']} (Match: {int(target_assess['suitability_score']*100)}%) | Threats: {target_assess['climate_threats'][:50]}... | Pests: {target_assess['major_pests_diseases'][:2]}")

    # 3. Test Yield with village and crop risk
    print('\n=== 2. YIELD PREDICTION HTTP TESTS ===')
    for crop, state, dist, season in [
        ('Rice', 'Karnataka', 'Gokak, Belgaum', 'Kharif'),
        ('Wheat', 'Punjab', 'Khanna, Ludhiana', 'Rabi'),
    ]:
        r = requests.post(f'{BASE}/predictions/yield', json={'crop': crop, 'state': state, 'district': dist, 'season': season, 'area_hectares': 2.0}, headers=headers)
        d = r.json()
        print(f'{crop} in {dist}, {state} -> Yield: {d["predicted_yield_kg_per_hectare"]} kg/ha | Accuracy: {int(d["confidence"]*100)}% | Risk: {d.get("crop_risk_assessment", {}).get("overall_risk_level")}')

    # 4. Test Market Price
    print('\n=== 3. MARKET PRICE HTTP TESTS ===')
    for crop, state, dist, months in [
        ('Cotton', 'Maharashtra', 'Baramati, Pune', 1),
        ('Wheat', 'Punjab', 'Samana, Patiala', 2),
    ]:
        r = requests.post(f'{BASE}/predictions/market-price', json={'crop': crop, 'state': state, 'district': dist, 'months_ahead': months}, headers=headers)
        d = r.json()
        print(f'{crop} in {dist}, {state} (+{months}m) -> Price: Rs {d["predicted_price_per_quintal"]}/q | Risk: {d.get("crop_risk_assessment", {}).get("overall_risk_level")}')

    # 5. Test Climate Risk
    print('\n=== 4. CLIMATE RISK HTTP TESTS ===')
    r = requests.post(f'{BASE}/predictions/climate-risk', json={'state': 'Karnataka', 'district': 'Chikkodi, Belgaum', 'crop': 'Cotton', 'temperature': 39.5, 'rainfall': 20.0}, headers=headers)
    d = r.json()
    print(f'Risk level: {d["overall_risk_level"]} | Accuracy: {int(d["confidence"]*100)}% | Crop Risk: {d.get("crop_risk_assessment", {}).get("overall_risk_level")}')

    # 6. Test Irrigation Advice
    print('\n=== 5. IRRIGATION ADVICE HTTP TESTS ===')
    r = requests.post(f'{BASE}/predictions/irrigation', json={'crop': 'Wheat', 'soil_type': 'Alluvial', 'temperature': 31.0, 'humidity': 40.0, 'recent_rainfall_mm': 5.0, 'growth_stage': 'Vegetative Growth'}, headers=headers)
    d = r.json()
    print(f'Need water: {d["should_irrigate"]} | Urgency: {d["urgency"]} | Accuracy: {int(d["confidence"]*100)}% | Crop Risk: {d.get("crop_risk_assessment", {}).get("overall_risk_level")}')

    # 7. Test Revenue Profit
    print('\n=== 6. REVENUE & PROFIT HTTP TESTS ===')
    r = requests.post(f'{BASE}/predictions/revenue', json={'crop': 'Cotton', 'area_hectares': 2.0, 'predicted_yield_kg_per_hectare': 2100.0, 'predicted_price_per_quintal': 7800.0}, headers=headers)
    d = r.json()
    print(f'Revenue: Rs {d["expected_revenue"]} | Profit: Rs {d["expected_profit"]} | Crop Risk: {d.get("crop_risk_assessment", {}).get("overall_risk_level")}')

if __name__ == '__main__':
    main()
