import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.geography import Country, State, District, SubDistrict, Village

async def seed_geography_data(session: AsyncSession):
    # Seed India as a Country
    result = await session.execute(select(Country).filter_by(code="IN"))
    india = result.scalars().first()
    if not india:
        india = Country(
            code="IN",
            name="India",
            iso_alpha2="IN",
            iso_alpha3="IND",
            admin_hierarchy_config={"levels": ["State", "District", "SubDistrict", "Village"]}
        )
        session.add(india)
        await session.commit()
        await session.refresh(india)

    # Load states
    with open("data/geography/states.json", "r") as f:
        states_data = json.load(f)
        
    for state_info in states_data:
        result = await session.execute(select(State).filter_by(code=state_info["code"]))
        state = result.scalars().first()
        if not state:
            state = State(
                country_id=india.id,
                code=state_info["code"],
                census_code=state_info.get("census_code"),
                name=state_info["name"],
                state_type=state_info.get("state_type", "State"),
                source="Census 2011"
            )
            session.add(state)
    await session.commit()
    print("Geography data seeded successfully (States).")
