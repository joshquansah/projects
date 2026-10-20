import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api";
import { BOARD_BASE_URL } from "../config";

export default function DemoStartButton({ className, children = "Try Demo" }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startDemo() {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      // Call the backend demo start. Backend strategy (pool or create-on-demand)
      // is opaque to the frontend; it must return the agreed response shape.
      const data = await request("POST", `${BOARD_BASE_URL}/tenants/demo`);

      // Minimal defensive checks
      if (!data?.token || !data?.user) {
        throw new Error("Invalid demo response");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Prefer server-provided entryPath for correct landing
      const target = data.entryPath || "/board";
      // navigate within SPA after storing token
      navigate(target, { replace: true });
    } catch (err) {
      // Surface friendly messages for rate-limit / abuse if backend communicates them
      setError(err?.message || "Unable to start demo. Try again later.");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "inline-block" }}>
      <button
        className={className}
        onClick={startDemo}
        disabled={loading}
        aria-busy={loading}
        style={{
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Starting demo…" : children}
      </button>

      {error && (
        <div role="alert" style={{ color: "#dc2626", marginTop: 8 }}>
          {error}
        </div>
      )}
    </div>
  );
}