import type { Booking } from "../types";

type Props = {
  booking: Booking;
  onCancel: (code: string) => void;
};

export default function BookingCard({ booking, onCancel }: Props) {
  const isCancelled = booking.status === "cancelled";
  const isPaid =
    booking.payment_status === "paid" || booking.payment_status === "cod_paid";
  const isCod = booking.payment_method === "cod";

  const payLabel = isCancelled
    ? "Cancelled"
    : isPaid
    ? booking.payment_method === "upi"
      ? "UPI · Paid ✅"
      : "Cash · Collected ✅"
    : isCod
    ? "Cash on arrival ⚠"
    : "UPI · Pending ⚠";

  const waText = encodeURIComponent(
    `My booking: ${booking.booking_code} on ${booking.date} at ${booking.start_time.slice(
      0,
      5
    )}`
  );
  const wa = `https://wa.me/?text=${waText}`;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-5 border ${
        isCancelled ? "border-red-200 opacity-70" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">
            {booking.date} · {booking.start_time.slice(0, 5)} –{" "}
            {booking.end_time.slice(0, 5)}
          </p>
          <p className="text-sm text-slate-500 mt-1">₹{booking.amount}</p>
        </div>
        <span className="text-xs bg-slate-100 px-2 py-1 rounded-lg">
          {booking.booking_code}
        </span>
      </div>

      <p
        className={`text-sm mt-3 ${
          isCancelled
            ? "text-red-500"
            : isPaid
            ? "text-emerald-600"
            : "text-amber-600"
        }`}
      >
        {payLabel}
      </p>

      {!isCancelled && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onCancel(booking.booking_code)}
            className="text-sm px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
          >
            Cancel
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            Share on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}