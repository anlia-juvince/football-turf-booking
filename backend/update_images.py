from app.database import SessionLocal
from app.models import Turf

db = SessionLocal()
turf = db.query(Turf).first()
if turf:
    turf.images = [
        "/turf/photo1.png",
        "/turf/photo2.png",
        "/turf/photo3.png",
    ]
    db.commit()
    print("Images updated!")
else:
    print("No turf found")
db.close()