import asyncio
from database import engine, Base
from models import EventBoard, EventBoardItem

async def create_tables():
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
        print("✓ Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())
