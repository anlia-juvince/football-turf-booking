from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import turf, booking  # noqa: F401
from app.routers import turf as turf_router
from app.routers import bookings as bookings_router
from app.routers import admin as admin_router


app = FastAPI(title="Football Turf Booking API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


app.include_router(turf_router.router)
app.include_router(bookings_router.router)
app.include_router(admin_router.router)


@app.get("/")
def root():
    return {"message": "Football Turf Booking API is running"}