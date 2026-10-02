from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Time,
    DateTime,
    UniqueConstraint,
)

from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)

    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    hours = Column(Integer, nullable=False, default=1)
    amount = Column(Integer, nullable=False)

    payment_method = Column(String, nullable=False)   # "upi" | "cod"
    payment_status = Column(String, nullable=False, default="pending")
    # pending | paid | cod | cod_paid

    status = Column(String, nullable=False, default="confirmed")
    # confirmed | cancelled

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("date", "start_time", name="no_double_booking"),
    )