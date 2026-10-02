from datetime import time
from typing import List

from pydantic import BaseModel


class TurfOut(BaseModel):
    id: int
    name: str
    city: str
    address: str | None = None
    price_per_hour: int
    open_time: time
    close_time: time
    images: List[str] = []
    amenities: List[str] = []

    class Config:
        from_attributes = True