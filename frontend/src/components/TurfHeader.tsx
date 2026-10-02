import type { Turf } from "../types";

export default function TurfHeader({ turf }: { turf: Turf }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {turf.images.slice(0, 3).map((img, i) => (
          <div
            key={i}
            className="aspect-video bg-slate-100 rounded-xl overflow-hidden"
          >
            <img
              src={img}
              alt={`${turf.name} photo ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
      {turf.name}
      </h1>
      <p className="text-slate-600 mt-1">
        {turf.city} · ₹{turf.price_per_hour}/hour · Open{" "}
        {turf.open_time.slice(0, 5)} – {turf.close_time.slice(0, 5)}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {turf.amenities.map((a) => (
          <span
            key={a}
            className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full"
          >
            ✓ {a}
          </span>
        ))}
      </div>
    </div>
  );
}