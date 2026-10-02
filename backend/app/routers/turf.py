from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.turf import Turf
from app.models.booking import Booking
from app.schemas.turf import TurfOut
from app.schemas.booking import SlotOut


router = APIRouter(prefix="/turf", tags=["turf"])


def _get_turf(db: Session) -> Turf:
    turf = db.query(Turf).first()
    if not turf:
        raise HTTPException(status_code=404, detail="No turf configured")
    return turf


@router.get("", response_model=TurfOut)
def get_turf(db: Session = Depends(get_db)):
    return _get_turf(db)


@router.get("/slots", response_model=list[SlotOut])
def get_slots(
    date_str: str = Query(..., alias="date"),
    db: Session = Depends(get_db),
):
    turf = _get_turf(db)

    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date. Use YYYY-MM-DD")

    bookings = (
        db.query(Booking)
        .filter(
            Booking.date == target_date,
            Booking.status == "confirmed",
        )
        .all()
    )

    booked_ranges = [(b.start_time, b.end_time) for b in bookings]

    slots: list[SlotOut] = []

    current = datetime.combine(target_date, turf.open_time)
    day_end = datetime.combine(target_date, turf.close_time)

    while current < day_end:
        slot_start = current.time()
        slot_end = (current + timedelta(hours=1)).time()

        is_booked = any(
            b_start < slot_end and b_end > slot_start
            for (b_start, b_end) in booked_ranges
        )

        slots.append(
            SlotOut(
                start_time=slot_start,
                end_time=slot_end,
                price=turf.price_per_hour,
                status="booked" if is_booked else "available",
            )
        )

        current += timedelta(hours=1)

    return slots