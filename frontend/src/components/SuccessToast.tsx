import type { Booking } from "../types";

type Props = {
  booking: Booking;
  onClose: () => void;
};

export default function SuccessToast({ booking, onClose }: Props) {
  const text = encodeURIComponent(
    `I booked ${booking.date} at ${booking.start_time.slice(
      0,
      5
    )} – ${booking.end_time.slice(0, 5)}. Booking: ${booking.booking_code}`
  );
  const wa = `https://wa.me/?text=${text}`;

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-2xl p-5 max-w-sm z-50 border border-slate-200">
      <div className="flex items-start gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-semibold">Booked!</p>
          <p className="text-sm text-slate-600">
            {booking.booking_code}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Save this code — you'll need it later.
          </p>
          <div className="flex gap-2 mt-3">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg"
            >
              Share on WhatsApp
            </a>
            <button
              onClick={onClose}
              className="text-xs border border-slate-300 px-3 py-1.5 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}