print(">>> seed.py started")

from datetime import time

print(">>> importing database")
from app.database import SessionLocal, Base, engine

print(">>> importing models")
from app.models import Turf, booking  # noqa: F401

print(">>> creating tables")
Base.metadata.create_all(bind=engine)

print(">>> opening db session")
db = SessionLocal()

print(">>> checking for existing turf")
existing = db.query(Turf).first()
if existing:
    print(f"Turf already exists: {existing.name}")
else:
    print(">>> inserting new turf")
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
print(">>> done")