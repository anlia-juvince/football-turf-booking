from datetime import time

from app.database import SessionLocal, Base, engine
from app.models import Turf, booking  # noqa: F401


Base.metadata.create_all(bind=engine)

db = SessionLocal()

existing = db.query(Turf).first()
if existing:
    existing.name = "Amlia Hub"
    existing.city = "Kozhikode"
    existing.address = "Kozhikode, Kerala"
    existing.images = [
        "/turf/photo1.png",
        "/turf/photo2.png",
        "/turf/photo3.png",
    ]
    db.commit()
    print(f"Updated turf: {existing.name}")
else:
    turf = Turf(
        name="Amlia Hub",
        city="Kozhikode",
        address="Kozhikode, Kerala",
        price_per_hour=1000,
        open_time=time(6, 0),
        close_time=time(23, 0),
        images=[
            "/turf/photo1.png",
            "/turf/photo2.png",
            "/turf/photo3.png",
        ],
        amenities=[
            "Floodlights",
            "Parking",
            "Changing Room",
            "Drinking Water",
        ],
    )
    db.add(turf)
    db.commit()
    print(f"Inserted turf: {turf.name}")

db.close()