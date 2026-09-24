import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.agriculture import CropCategory, Crop

async def seed_agriculture_data(session: AsyncSession):
    # Load Crop Categories
    with open("data/crops/categories.json", "r", encoding="utf-8") as f:
        categories_data = json.load(f)
        
    for cat_info in categories_data:
        result = await session.execute(select(CropCategory).filter_by(name=cat_info["name"]))
        cat = result.scalars().first()
        if not cat:
            cat = CropCategory(
                name=cat_info["name"],
                description=cat_info.get("description")
            )
            session.add(cat)
    await session.commit()

    # Load Crops
    with open("data/crops/crops.json", "r", encoding="utf-8") as f:
        crops_data = json.load(f)
        
    for crop_info in crops_data:
        # Get category id
        result = await session.execute(select(CropCategory).filter_by(name=crop_info["category_name"]))
        category = result.scalars().first()
        
        if category:
            result = await session.execute(select(Crop).filter_by(name=crop_info["name"]))
            crop = result.scalars().first()
            if not crop:
                crop = Crop(
                    category_id=category.id,
                    name=crop_info["name"],
                    scientific_name=crop_info.get("scientific_name"),
                    water_requirement_mm=crop_info.get("water_requirement_mm")
                )
                session.add(crop)
    await session.commit()
    print("Agriculture data seeded successfully (Crops).")
