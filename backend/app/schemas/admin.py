from datetime import date as date_type, time, datetime

from pydantic import BaseModel


class AdminBookingOut(BaseModel):
    id: int
    booking_code: str
    name: str
    phone: str
    date: date_type
    start_time: time
    end_time: time
    hours: int
    amount: int
    payment_method: str
    payment_status: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AdminSummary(BaseModel):
    date: date_type
    total_bookings: int
    confirmed: int
    cancelled: int
    earned: int
    upi_paid: int
    cod_pending: int
    cod_collected: int