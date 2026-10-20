import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DemoStartButton from "../components/DemoStartButton";
import accordLockup from "../assets/accord-lockup.svg";

const COLORS = {
  primary: "#1d4ed8",
  primaryDark: "#1e3a8a",
  primaryLight: "#dbeafe",
  accent: "#f59e0b",
  background: "#ffffff",
  surface: "#f8fafc",
  border: "#e2e8f0",
  text: "#0f172a",
  textSecondary: "#64748b",
};

const FEATURES = [
  {
    title: "Enforced Ownership",
    description: "Every task has one named owner. Not a team. Not unassigned. One person.",
  },
  {
    title: "Automatic Escalation",
    description: "Accord flags stale work and notifies the owner, then their manager. No one has to remember to check.",
  },
  {
    title: "AI Task Creation",
    description: "Paste anything - an email, a Slack message, a sentence. Accord creates the project, assigns the team, and flags anything unresolved.",
  },
  {
    title: "Company-Wide Rollup",
    description: "See what every person owns across every project, filtered by team, department, or status. No report building required.",
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Enforced single ownership",
    accord: "✓",
    jira: "⚠",
    asana: "⚠",
    sharepoint: "✗",
    teams: "✗",
  },
  {
    feature: "Automatic staleness detection",
    accord: "✓",
    jira: "⚠",
    asana: "✗",
    sharepoint: "✗",
    teams: "✗",
  },
  {
    feature: "Zero-config escalation to manager",
    accord: "✓",
    jira: "✗",
    asana: "✗",
    sharepoint: "✗",
    teams: "✗",
  },
  {
    feature: "AI task creation from unstructured input",
    accord: "✓",
    jira: "⚠",
    asana: "⚠",
    sharepoint: "✗",
    teams: "✗",
  },
  {
    feature: "Cross-company per-person rollup",
    accord: "✓",
    jira: "✗",
    asana: "⚠",
    sharepoint: "✗",
    teams: "✗",
  },
  {
    feature: "Full audit trail per task",
    accord: "✓",
    jira: "✓",
    asana: "⚠",
    sharepoint: "⚠",
    teams: "✗",
  },
  {
    feature: "Works across all your existing tools",
    accord: "✓",
    jira: "⚠",
    asana: "⚠",
    sharepoint: "⚠",
    teams: "⚠",
  },
];

function Logo() {
  return (
    <img
      src={accordLockup}
      alt="Accord logo"
      style={{
        display: "block",
        width: 142,
        height: "auto",
      }}
    />
  );
}

function HeroBoardMock() {
  const columnStyle = {
    flex: 1,
    minWidth: 140,
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: 12,
    padding: 12,
  };

  return (
    <div
      style={{
        marginTop: 28,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 14,
        padding: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={columnStyle}>
          <p style={{ color: "#dbeafe", fontWeight: 600, marginBottom: 10 }}>Todo</p>
          <div style={{ background: "#dbeafe", color: COLORS.primaryDark, borderRadius: 10, padding: "8px 10px", marginBottom: 8 }}>Draft compliance checklist</div>
          <div style={{ background: "#fde68a", color: "#92400e", borderRadius: 10, padding: "8px 10px" }}>Resolve KYC ownership gap</div>
        </div>
        <div style={columnStyle}>
          <p style={{ color: "#dbeafe", fontWeight: 600, marginBottom: 10 }}>In Progress</p>
          <div style={{ background: "#bfdbfe", color: COLORS.primaryDark, borderRadius: 10, padding: "8px 10px", marginBottom: 8 }}>Define API contracts</div>
          <div style={{ background: "#fef3c7", color: "#92400e", borderRadius: 10, padding: "8px 10px" }}>Escalate stale onboarding ticket</div>
        </div>
        <div style={columnStyle}>
          <p style={{ color: "#dbeafe", fontWeight: 600, marginBottom: 10 }}>In Review</p>
          <div style={{ background: "#dcfce7", color: "#166534", borderRadius: 10, padding: "8px 10px", marginBottom: 8 }}>Manager sign-off: fraud model</div>
          <div style={{ background: "#e2e8f0", color: "#334155", borderRadius: 10, padding: "8px 10px" }}>Audit trail exported</div>
        </div>
      </div>
    </div>
  );
}

function FeatureImage({ title }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        height: 280,
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.primaryLight,
        display: "grid",
        placeItems: "center",
        color: COLORS.primary,
        fontWeight: 700,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {title}
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle = useMemo(
    () => ({
      position: "sticky",
      top: 0,
      zIndex: 30,
      background: "#fff",
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
      transition: "border-color 0.2s ease",
    }),
    [scrolled],
  );

  function scrollToFeatures() {
    const node = document.getElementById("features");
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ background: COLORS.background, color: COLORS.text, fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <header style={navStyle}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Logo />
          <nav style={{ display: "flex", alignItems: "center", gap: 18, color: COLORS.textSecondary, fontWeight: 500 }}>
            <a href="#features" style={{ textDecoration: "none" }}>Features</a>
            <a href="#compare" style={{ textDecoration: "none" }}>Compare</a>
            <Link to="/login" style={{ textDecoration: "none" }}>Login</Link>
            <Link
              to="/register"
              style={{
                textDecoration: "none",
              }}
            >
              Register
            </Link>
            <DemoStartButton
                className="btn-primary"
                ></DemoStartButton>
          </nav>
        </div>
      </header>

      <section style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "86px 20px 70px" }}>
          <h1 style={{ color: "#fff", fontSize: "clamp(2rem, 4.5vw, 3.35rem)", lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 900 }}>
            Accountability infrastructure for teams that can&apos;t afford to slip.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.92)", marginTop: 18, maxWidth: 900, fontSize: "1.08rem" }}>
            Accord gives every project a named owner, flags silence before it becomes a problem, and shows leadership exactly who owns what - across every team, in real time.
          </p>

          <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                background: COLORS.accent,
                color: "#1f2937",
                border: `1px solid ${COLORS.accent}`,
                borderRadius: 8,
                padding: "11px 18px",
                fontWeight: 700,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              Register Now
            </Link>
            <button
              type="button"
              onClick={scrollToFeatures}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: 8,
                padding: "11px 18px",
                fontWeight: 600,
              }}
            >
              See how it works
            </button>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 18, flexWrap: "wrap", color: "#dbeafe", fontSize: 14 }}>
            <span>Real-time updates</span>
            <span>AI-powered task creation</span>
            <span>Built for financial services</span>
          </div>

          <HeroBoardMock />
        </div>
      </section>

      <section id="features" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 20px 52px" }}>
        <h2 style={{ fontSize: "clamp(1.65rem, 3vw, 2.25rem)", letterSpacing: "-0.02em" }}>
          Everything your team needs to stay accountable
        </h2>

        <div style={{ marginTop: 36, display: "grid", gap: 28 }}>
          {FEATURES.map((feature, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <article
                key={feature.title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  alignItems: "center",
                  gap: 22,
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  padding: 22,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ order: reverse ? 2 : 1 }}>
                  <h3 style={{ marginBottom: 10, fontSize: "1.25rem" }}>{feature.title}</h3>
                  <p style={{ color: COLORS.textSecondary }}>{feature.description}</p>
                </div>
                <div style={{ order: reverse ? 1 : 2, display: "flex", justifyContent: "center" }}>
                  <FeatureImage title={feature.title} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="compare" style={{ maxWidth: 1140, margin: "0 auto", padding: "32px 20px 70px" }}>
        <h2 style={{ fontSize: "clamp(1.65rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>Why teams choose Accord</h2>
        <p style={{ marginTop: 8, color: COLORS.textSecondary, maxWidth: 760 }}>
          Other tools show you what&apos;s happening. Accord tells you when something&apos;s gone quiet.
        </p>

        <div style={{ marginTop: 22, overflowX: "auto", border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
          <table style={{ width: "100%", minWidth: 880, borderCollapse: "collapse", background: "#fff" }}>
            <thead>
              <tr>
                {[
                  "Feature",
                  "Accord",
                  "Jira",
                  "Asana",
                  "SharePoint",
                  "Microsoft Teams",
                ].map((heading, i) => (
                  <th
                    key={heading}
                    style={{
                      textAlign: i === 0 ? "left" : "center",
                      padding: "12px 14px",
                      borderBottom: `1px solid ${COLORS.border}`,
                      fontSize: 13,
                      color: COLORS.textSecondary,
                      fontWeight: 700,
                      background: i === 1 ? COLORS.primaryLight : "#fff",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature}>
                  <td style={{ padding: "11px 14px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 500 }}>{row.feature}</td>
                  {[
                    row.accord,
                    row.jira,
                    row.asana,
                    row.sharepoint,
                    row.teams,
                  ].map((value, index) => (
                    <td
                      key={`${row.feature}-${index}`}
                      style={{
                        textAlign: "center",
                        padding: "11px 14px",
                        borderBottom: `1px solid ${COLORS.border}`,
                        fontWeight: value === "✓" ? 700 : 600,
                        color: value === "✓" ? COLORS.primary : value === "⚠" ? "#b45309" : "#64748b",
                        background: index === 0 ? COLORS.primaryLight : "#fff",
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ background: COLORS.primaryDark }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "58px 20px", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.7rem, 3vw, 2.35rem)", letterSpacing: "-0.02em" }}>Ready to see who owns what?</h2>
          <p style={{ marginTop: 10, color: "#c7d2fe" }}>Set up your organization in under two minutes.</p>
          <Link
            to="/register"
            style={{
              marginTop: 20,
              display: "inline-block",
              textDecoration: "none",
              background: COLORS.accent,
              color: "#1f2937",
              borderRadius: 8,
              padding: "11px 20px",
              fontWeight: 700,
              border: `1px solid ${COLORS.accent}`,
            }}
          >
            Register Now
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${COLORS.border}`, background: "#fff" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "22px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <Logo />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: COLORS.textSecondary }}>
            <a href="#features" style={{ textDecoration: "none" }}>Features</a>
            <a href="#compare" style={{ textDecoration: "none" }}>Compare</a>
            <Link to="/login" style={{ textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ textDecoration: "none" }}>Register</Link>
            
          </div>
          <span style={{ color: COLORS.textSecondary }}>© 2026 Accord</span>
        </div>
      </footer>
    </div>
  );
}
