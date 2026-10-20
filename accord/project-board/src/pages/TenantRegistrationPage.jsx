import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../api";
import { BOARD_BASE_URL } from "../config";
import accordWordmark from "../assets/accord-wordmark.svg";

const COLORS = {
  primary: "#1d4ed8",
  surface: "#f8fafc",
  border: "#e2e8f0",
  text: "#0f172a",
  secondary: "#64748b",
  error: "#dc2626",
};

const EMPTY_FORM = {
  companyName: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function TenantRegistrationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const nextErrors = {};

    if (!form.companyName.trim()) nextErrors.companyName = "Company name is required.";
    if (!form.name.trim()) nextErrors.name = "Your full name is required.";
    if (!form.email.trim()) nextErrors.email = "Work email is required.";
    if (!form.password) nextErrors.password = "Password is required.";
    if (form.password && form.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (!form.confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        companyName: form.companyName.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      };

      const data = await request("POST", `${BOARD_BASE_URL}/tenants/register`, payload);

      localStorage.setItem("token", data?.token || "");
      localStorage.setItem("user", JSON.stringify(data?.user || null));

      navigate("/board", { replace: true });
    } catch (error) {
      setApiError(error.message || "Unable to create workspace.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: COLORS.surface,
        padding: 20,
        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          width: "min(100%, 460px)",
          background: "#fff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          padding: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <img
            src={accordWordmark}
            alt="Accord logo"
            style={{
              display: "block",
              width: 180,
              height: "auto",
            }}
          />
        </div>

        <h1 style={{ fontSize: 26, color: COLORS.text, marginBottom: 6, letterSpacing: "-0.02em" }}>Set up your workspace</h1>
        <p style={{ color: COLORS.secondary, marginBottom: 20 }}>Your team will be ready in seconds.</p>

        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="Company name"
            value={form.companyName}
            onChange={(value) => updateField("companyName", value)}
            error={errors.companyName}
          />
          <Field
            label="Your full name"
            value={form.name}
            onChange={(value) => updateField("name", value)}
            error={errors.name}
          />
          <Field
            label="Work email"
            type="email"
            value={form.email}
            onChange={(value) => updateField("email", value)}
            error={errors.email}
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => updateField("password", value)}
            error={errors.password}
          />
          <Field
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(value) => updateField("confirmPassword", value)}
            error={errors.confirmPassword}
          />

          {apiError && <p style={{ color: COLORS.error, marginBottom: 12, fontSize: 13 }}>{apiError}</p>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              background: COLORS.primary,
              color: "#fff",
              border: `1px solid ${COLORS.primary}`,
              borderRadius: 8,
              padding: "11px 14px",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.72 : 1,
            }}
          >
            {submitting ? "Setting up your workspace…" : "Create workspace"}
          </button>
        </form>

        <p style={{ marginTop: 14, color: COLORS.secondary, fontSize: 14 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: COLORS.primary, textDecoration: "none", fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}

function Field({ label, type = "text", value, onChange, error }) {
  return (
    <label style={{ display: "block", marginBottom: 13 }}>
      <span style={{ display: "block", color: "#334155", marginBottom: 6, fontSize: 14 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          border: `1px solid ${error ? "#dc2626" : "#e2e8f0"}`,
          borderRadius: 10,
          padding: "10px 12px",
          fontSize: 14,
        }}
      />
      {error && <span style={{ display: "block", marginTop: 5, color: "#dc2626", fontSize: 12 }}>{error}</span>}
    </label>
  );
}
