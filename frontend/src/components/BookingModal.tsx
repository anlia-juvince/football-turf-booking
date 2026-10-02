import { useState } from "react";
import type { Slot } from "../types";

type Props = {
  slot: Slot;
  date: string;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    phone: string;
    hours: number;
    payment_method: "upi" | "cod";
  }) => Promise<void>;
};

export default function BookingModal({ slot, date, onClose, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState(1);
  const [payment, setPayment] = useState<"upi" | "cod">("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!name.trim()) return setError("Please enter your name");
    if (phone.length < 10) return setError("Please enter a valid 10-digit phone");

    setLoading(true);
    try {
      await onConfirm({ name, phone, hours, payment_method: payment });
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold">
          Book {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {date} · ₹{slot.price}/hour
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="10-digit phone"
              maxLength={15}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Duration</label>
            <div className="flex gap-2 mt-1">
              {[1, 2].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`flex-1 py-2 rounded-lg border ${
                    hours === h
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-slate-300"
                  }`}
                >
                  {h} hour{h > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Payment</label>
            <div className="space-y-2 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={payment === "upi"}
                  onChange={() => setPayment("upi")}
                />
                Pay via UPI
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                />
                Pay at Turf (Cash)
              </label>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4">
          Free cancellation up to 6 hours before your slot.
        </p>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-slate-900 text-white disabled:opacity-50"
          >
            {loading ? "Booking..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}