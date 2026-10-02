import type { Slot } from "../types";

type Props = {
  slots: Slot[];
  onSelect: (slot: Slot) => void;
};

export default function SlotGrid({ slots, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((slot) => {
        const available = slot.status === "available";
        return (
          <button
            key={slot.start_time}
            onClick={() => available && onSelect(slot)}
            disabled={!available}
            className={`text-left p-3 rounded-xl border transition ${
              available
                ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <div className="text-sm font-medium">
              {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
            </div>
            <div className="text-xs mt-1">
              {available ? `₹${slot.price}` : "Booked"}
            </div>
          </button>
        );
      })}
    </div>
  );
}