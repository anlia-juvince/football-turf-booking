import { QRCodeSVG } from "qrcode.react";
import type { Booking } from "../types";

type Props = {
  booking: Booking;
  onPaid: () => Promise<void>;
  onClose: () => void;
};

const UPI_NAME = "AMELIA ARENA";
const UPI_ID = "amelia@upi";

export default function UpiPaymentModal({ booking, onPaid, onClose }: Props) {
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    UPI_NAME
  )}&am=${booking.amount}&cu=INR&tn=${booking.booking_code}`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-bold">Pay ₹{booking.amount}</h2>
        <p className="text-sm text-slate-500 mt-1">
          Scan with GPay, PhonePe, or Paytm
        </p>

        <div className="flex justify-center mt-6">
          <div className="bg-white p-4 border rounded-xl">
            <QRCodeSVG value={upiLink} size={200} />
          </div>
        </div>

        <p className="text-sm mt-4 text-slate-600">{UPI_ID}</p>
        <p className="text-xs text-slate-400 mt-1">
          Booking: {booking.booking_code}
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={onPaid}
            className="flex-1 py-2 rounded-lg bg-emerald-600 text-white"
          >
            I've Paid
          </button>
        </div>
      </div>
    </div>
  );
}