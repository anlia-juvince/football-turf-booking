from datetime import date as date_type, time, datetime
from typing import Literal

from pydantic import BaseModel, Field


class SlotOut(BaseModel):
    start_time: time
    end_time: time
    price: int
    status: Literal["available", "booked"]


class BookingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    date: date_type
    start_time: time
    hours: int = Field(1, ge=1, le=2)
    payment_method: Literal["upi", "cod"]


class BookingOut(BaseModel):
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