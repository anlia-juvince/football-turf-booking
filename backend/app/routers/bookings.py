import random
import string
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.turf import Turf
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingOut


router = APIRouter(prefix="/bookings", tags=["bookings"])


def _generate_code() -> str:
    part = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"TURF-{part}"


def _get_turf(db: Session) -> Turf:
    turf = db.query(Turf).first()
    if not turf:
        raise HTTPException(status_code=404, detail="No turf configured")
    return turf


@router.post("", response_model=BookingOut, status_code=201)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    turf = _get_turf(db)

    start_dt = datetime.combine(payload.date, payload.start_time)
    end_dt = start_dt + timedelta(hours=payload.hours)
    end_time = end_dt.time()

    overlap = (
        db.query(Booking)
        .filter(
            Booking.date == payload.date,
            Booking.status == "confirmed",
            Booking.start_time < end_time,
            Booking.end_time > payload.start_time,
        )
        .first()
    )
    if overlap:
        raise HTTPException(status_code=400, detail="Slot already booked")

    amount = turf.price_per_hour * payload.hours

    booking = Booking(
        booking_code=_generate_code(),
        name=payload.name,
        phone=payload.phone,
        date=payload.date,
        start_time=payload.start_time,
        end_time=end_time,
        hours=payload.hours,
        amount=amount,
        payment_method=payload.payment_method,
        payment_status="pending" if payload.payment_method == "upi" else "cod",
        status="confirmed",
    )
    db.add(booking)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Slot just got booked by someone else")

    db.refresh(booking)
    return booking


@router.get("/by-phone", response_model=list[BookingOut])
def bookings_by_phone(
    phone: str = Query(...),
    db: Session = Depends(get_db),
):
    return (
        db.query(Booking)
        .filter(Booking.phone == phone)
        .order_by(Booking.date.desc(), Booking.start_time.desc())
        .all()
    )


@router.get("/{code}", response_model=BookingOut)
def get_booking(code: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.booking_code == code).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.post("/{code}/mark-paid", response_model=BookingOut)
def mark_paid(code: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.booking_code == code).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.payment_method != "upi":
        raise HTTPException(status_code=400, detail="Not a UPI booking")
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Booking is cancelled")

    booking.payment_status = "paid"
    db.commit()
    db.refresh(booking)
    return booking


@router.post("/{code}/cancel", response_model=BookingOut)
def cancel_booking(code: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.booking_code == code).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Already cancelled")

    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking