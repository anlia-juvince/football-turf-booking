from datetime import time

from app.database import SessionLocal, Base, engine
from app.models import Turf, booking  # noqa: F401


Base.metadata.create_all(bind=engine)

db = SessionLocal()

existing = db.query(Turf).first()
if existing:
    print(f"Turf already exists: {existing.name}")
else:
    turf = Turf(
        name="Green Field Arena",
        city="Mumbai",
        address="Andheri West, Mumbai",
        price_per_hour=1000,
        open_time=time(6, 0),
        close_time=time(23, 0),
        images=[
            "/turf/photo1.jpg",
            "/turf/photo2.jpg",
            "/turf/photo3.jpg",
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