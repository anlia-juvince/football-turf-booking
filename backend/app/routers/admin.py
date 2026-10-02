from datetime import date as date_type

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models.booking import Booking
from app.schemas.admin import AdminBookingOut, AdminSummary


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/bookings", response_model=list[AdminBookingOut])
def list_bookings(
    date: date_type = Query(...),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    return (
        db.query(Booking)
        .filter(Booking.date == date)
        .order_by(Booking.start_time)
        .all()
    )


@router.get("/summary", response_model=AdminSummary)
def summary(
    date: date_type = Query(...),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    bookings = db.query(Booking).filter(Booking.date == date).all()

    confirmed = [b for b in bookings if b.status == "confirmed"]
    cancelled = [b for b in bookings if b.status == "cancelled"]

    upi_paid = sum(b.amount for b in confirmed if b.payment_status == "paid")
    cod_pending = sum(b.amount for b in confirmed if b.payment_status == "cod")
    cod_collected = sum(b.amount for b in confirmed if b.payment_status == "cod_paid")

    return AdminSummary(
        date=date,
        total_bookings=len(bookings),
        confirmed=len(confirmed),
        cancelled=len(cancelled),
        earned=upi_paid + cod_collected,
        upi_paid=upi_paid,
        cod_pending=cod_pending,
        cod_collected=cod_collected,
    )


@router.post("/bookings/{code}/mark-collected", response_model=AdminBookingOut)
def mark_collected(
    code: str,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    booking = db.query(Booking).filter(Booking.booking_code == code).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.payment_method != "cod":
        raise HTTPException(status_code=400, detail="Not a COD booking")

    booking.payment_status = "cod_paid"
    db.commit()
    db.refresh(booking)
    return booking


@router.post("/bookings/{code}/cancel", response_model=AdminBookingOut)
def admin_cancel(
    code: str,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    booking = db.query(Booking).filter(Booking.booking_code == code).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Already cancelled")

    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking