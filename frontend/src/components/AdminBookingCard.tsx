import type { Booking } from "../types";

type Props = {
  booking: Booking;
  onMarkCollected: (code: string) => void;
  onCancel: (code: string) => void;
};

export default function AdminBookingCard({
  booking,
  onMarkCollected,
  onCancel,
}: Props) {
  const isCancelled = booking.status === "cancelled";
  const isCod = booking.payment_method === "cod";
  const codPending = isCod && booking.payment_status === "cod";
  const codCollected = booking.payment_status === "cod_paid";
  const upiPaid = booking.payment_status === "paid";

  const statusLabel = isCancelled
    ? "Cancelled"
    : upiPaid
    ? "UPI Paid ✅"
    : codCollected
    ? "Cash Collected ✅"
    : codPending
    ? "COD Pending ⚠"
    : "UPI Pending ⏳";

  const statusColor = isCancelled
    ? "text-red-500"
    : upiPaid || codCollected
    ? "text-emerald-600"
    : "text-amber-600";

  const wa = `https://wa.me/91${booking.phone}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-lg">
            {booking.start_time.slice(0, 5)} – {booking.end_time.slice(0, 5)}
          </p>
          <p className="text-sm text-slate-500">
            {booking.date} · {booking.hours} hour{booking.hours > 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">₹{booking.amount}</p>
          <p className={`text-xs mt-1 ${statusColor}`}>{statusLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-slate-500">Name: </span>
          {booking.name}
        </div>
        <div>
          <span className="text-slate-500">Phone: </span>
          {booking.phone}
        </div>
        <div>
          <span className="text-slate-500">Method: </span>
          {booking.payment_method.toUpperCase()}
        </div>
        <div>
          <span className="text-slate-500">Code: </span>
          {booking.booking_code}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {!isCancelled && (
          <>
            <a
              href={`tel:${booking.phone}`}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50"
            >
              Call
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              WhatsApp
            </a>
            {codPending && (
              <button
                onClick={() => onMarkCollected(booking.booking_code)}
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Mark Paid
              </button>
            )}
            <button
              onClick={() => onCancel(booking.booking_code)}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}