# ⚽ AMELIA ARENA

A full-stack football turf booking platform for **AMELIA ARENA** in **Kozhikode, Kerala**.

Players book hourly slots **without creating an account**, pay via dynamic UPI QR or cash on arrival, and manage their bookings using just their phone number. The turf owner gets a password-protected dashboard to see the day's bookings, collect payments, and manage slots.

**🔗 Live Demo:** [https://football-turf-booking-six.vercel.app](https://football-turf-booking-six.vercel.app)

**📦 Backend API:** [https://football-turf-booking.onrender.com](https://football-turf-booking.onrender.com)

**📖 API Docs:** [https://football-turf-booking.onrender.com/docs](https://football-turf-booking.onrender.com/docs)

---

## ✨ Features

### Player side (no login required)
- 🏟️ Browse turf info, photos, and amenities
- 📅 Pick a date and view hourly slots (available / booked)
- ⏱️ Book 1-hour or 2-hour slots
- 💳 Pay via **dynamic UPI QR code** (with amount pre-filled) or **Cash on Arrival**
- 📱 View upcoming and past bookings
- ❌ Cancel bookings
- 🔎 Recover bookings on any device via phone number lookup
- 💬 Share bookings via WhatsApp

### Owner side (password-protected)
- 📊 Dashboard with today's summary — total bookings, earnings, UPI paid, COD pending
- 📋 Full booking list with every field (name, phone, amount, method, status, code)
- 🎯 One-tap actions — Call, WhatsApp, Mark Paid, Cancel
- 🔍 Filters — Confirmed, Cancelled, COD, UPI
- 🔎 Search by name, phone, or booking code
- 📅 Date picker to view any day's bookings

---

## 🧰 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Backend** | FastAPI (Python 3.13), SQLAlchemy 2.0, Pydantic v2 |
| **Database** | SQLite |
| **Auth (admin)** | Shared key via `x-admin-key` header |
| **QR Code** | `qrcode.react` |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 🧠 Key Engineering Decisions

### 1. No login for players
Requiring an account to book a turf kills conversion. Instead:
- Booking captures just **name + phone**
- Return users are identified by `localStorage` (same device) or **phone lookup** (any device)
- Cancellation requires **booking code + phone** match

### 2. Double-booking prevention at the database level
Instead of writing locks or race-condition code, a **unique constraint** on `(date, start_time)` in PostgreSQL/SQLite guarantees that if two users submit the same slot simultaneously, the second insert fails automatically.

```python
__table_args__ = (
    UniqueConstraint("date", "start_time", name="no_double_booking"),
)
