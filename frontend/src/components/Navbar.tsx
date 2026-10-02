import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = !!sessionStorage.getItem("admin_key");

  const link = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-lg text-sm font-medium ${
          active
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-semibold text-lg">
            Amlia Hub
        </Link>
        <nav className="flex items-center gap-1">
          {link("/", "Home")}
          {link("/my-bookings", "My Bookings")}
          {link("/admin", isAdmin ? "Admin" : "Admin")}
        </nav>
      </div>
    </header>
  );
}