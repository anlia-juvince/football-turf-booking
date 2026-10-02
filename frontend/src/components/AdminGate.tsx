import { useState, type ReactNode } from "react";

export default function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    !!sessionStorage.getItem("admin_key")
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const submit = async () => {
    setError("");
    setChecking(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/summary?date=${today}`,
        { headers: { "x-admin-key": input } }
      );
      if (!res.ok) throw new Error("bad key");
      sessionStorage.setItem("admin_key", input);
      setUnlocked(true);
    } catch {
      setError("Wrong password");
    } finally {
      setChecking(false);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="max-w-sm mx-auto mt-24 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Owner Access</h2>
      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Admin password"
        className="w-full border rounded-lg px-3 py-2 mb-3"
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button
        onClick={submit}
        disabled={checking || !input}
        className="w-full bg-slate-900 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {checking ? "Checking…" : "Enter"}
      </button>
      <p className="text-xs text-slate-500 mt-3 text-center">
        Hint: greenfield123
      </p>
    </div>
  );
}