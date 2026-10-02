from sqlalchemy import Column, Integer, String, Time, JSON

from app.database import Base


class Turf(Base):
    __tablename__ = "turfs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    address = Column(String)
    price_per_hour = Column(Integer, nullable=False)
    open_time = Column(Time, nullable=False)
    close_time = Column(Time, nullable=False)
    images = Column(JSON, default=list)
    amenities = Column(JSON, default=list)