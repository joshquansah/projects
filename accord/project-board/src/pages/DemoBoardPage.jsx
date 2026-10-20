import { useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { Link, useNavigate } from "react-router-dom";
import { COLUMNS, STATUSES } from "../constants";
import KanbanColumn from "../components/KanbanColumn";
import TaskCard from "../components/TaskCard";
import TaskDetailPanel from "../components/TaskDetailPanel";
import { formatDate, isOverdueTask, summarizeProject } from "../utils/projectData";

const DEMO_USERS = [
  { id: "u1", name: "Sofia Chen", team: "Retail Banking" },
  { id: "u2", name: "Marcus Johnson", team: "Platform Engineering" },
  { id: "u3", name: "David Park", team: "Compliance" },
  { id: "u4", name: "Emily Tran", team: "Digital Banking" },
  { id: "u5", name: "Josh Williams", team: "Data & AI" },
  { id: "u6", name: "Priya Patel", team: "Platform Engineering" },
  { id: "u7", name: "Rachel Kim", team: "Compliance" },
  { id: "u8", name: "Natalie Brooks", team: "Cybersecurity" },
];

const MOCK_AI_RESPONSE = {
  created: [
    { id: "ai-1", title: "Define data schema for wallet integration", status: "TODO", owner: "Josh Williams", projectName: "Digital Wallet Launch", ownerResolved: true },
    { id: "ai-2", title: "Review KYC requirements with compliance", status: "TODO", owner: "David Park", projectName: "Digital Wallet Launch", ownerResolved: true },
    { id: "ai-3", title: "Set up staging environment", status: "TODO", owner: null, projectName: "Digital Wallet Launch", ownerResolved: false },
  ],
};

const INITIAL_PROJECTS = [
  {
    id: "p1",
    title: "Retail Onboarding Flow",
    status: "IN_PROGRESS",
    owner: { id: "u1", username: "Sofia Chen" },
    team: { name: "Retail Banking" },
    dueDate: "2026-09-15",
    tasks: [
      task("t1", "Define onboarding milestones", "IN_PROGRESS", "HIGH", "2026-08-21", "u1", false),
      task("t2", "Draft branch script", "TODO", "MEDIUM", "2026-08-28", "u1", false),
      task("t3", "Validate digital identity flow", "IN_REVIEW", "HIGH", "2026-08-17", "u8", true),
      task("t4", "Set escalation owners", "DONE", "LOW", "2026-08-06", "u3", false),
      task("t5", "Confirm account opening SLA", "TODO", "MEDIUM", "2026-08-12", "u7", false),
      task("t6", "Integrate welcome email trigger", "BLOCKED", "HIGH", "2026-08-09", "u6", false),
    ],
  },
  {
    id: "p2",
    title: "API Gateway Migration",
    status: "BLOCKED",
    owner: { id: "u2", username: "Marcus Johnson" },
    team: { name: "Platform Engineering" },
    dueDate: "2026-08-30",
    tasks: [
      task("t7", "Define API contracts", "IN_PROGRESS", "HIGH", "2026-08-02", "u6", false),
      task("t8", "Set up CI pipeline", "TODO", "MEDIUM", "2026-08-04", "u2", false),
      task("t9", "Complete canary test plan", "BLOCKED", "HIGH", "2026-08-01", "u6", false),
      task("t10", "Review auth token strategy", "IN_REVIEW", "MEDIUM", "2026-08-11", "u8", false),
    ],
  },
  {
    id: "p3",
    title: "Q3 Compliance Review",
    status: "IN_REVIEW",
    owner: { id: "u3", username: "David Park" },
    team: { name: "Compliance" },
    dueDate: "2026-08-01",
    tasks: [
      task("t11", "Draft compliance checklist", "IN_REVIEW", "HIGH", "2026-07-29", "u3", true),
      task("t12", "Map unresolved controls", "TODO", "HIGH", "2026-08-03", "u7", false),
      task("t13", "Share risk summary with legal", "DONE", "MEDIUM", "2026-07-28", "u3", false),
    ],
  },
  {
    id: "p4",
    title: "Digital Wallet Launch",
    status: "TODO",
    owner: { id: "u4", username: "Emily Tran" },
    team: { name: "Digital Banking" },
    dueDate: "2026-10-01",
    tasks: [
      task("t14", "Define wallet MVP scope", "TODO", "HIGH", "2026-08-26", "u4", false),
      task("t15", "Draft partner API checklist", "TODO", "MEDIUM", "2026-08-29", "u5", false),
      task("t16", "Set KYC fallback flow", "IN_PROGRESS", "HIGH", "2026-08-23", "u3", false),
      task("t17", "Prepare launch dashboard", "TODO", "LOW", "2026-09-02", "u4", false),
      task("t18", "Define customer comms plan", "TODO", "MEDIUM", "2026-09-07", "u1", false),
      task("t19", "Configure fraud alerting", "BLOCKED", "HIGH", "2026-09-10", "u8", false),
      task("t20", "Align release runbook", "IN_REVIEW", "MEDIUM", "2026-09-05", "u2", false),
      task("t21", "Review incident response SOP", "TODO", "MEDIUM", "2026-09-14", "u8", false),
    ],
  },
  {
    id: "p5",
    title: "Fraud Detection Model",
    status: "IN_PROGRESS",
    owner: { id: "u5", username: "Josh Williams" },
    team: { name: "Data & AI" },
    dueDate: "2026-09-01",
    tasks: [
      task("t22", "Collect model training features", "IN_PROGRESS", "HIGH", "2026-08-13", "u5", false),
      task("t23", "Tune anomaly thresholds", "TODO", "HIGH", "2026-08-14", "u5", false),
      task("t24", "Run drift monitoring check", "IN_REVIEW", "MEDIUM", "2026-08-20", "u8", false),
      task("t25", "Publish model card", "DONE", "LOW", "2026-08-06", "u3", false),
      task("t26", "Sign off governance controls", "BLOCKED", "HIGH", "2026-08-08", "u7", false),
    ],
  },
];

function task(id, title, status, priority, dueDate, ownerId, isStale) {
  const owner = DEMO_USERS.find((user) => user.id === ownerId);
  return {
    id,
    title,
    description: `${title} for demo flow`,
    status,
    priority,
    dueDate,
    isStale,
    owner: owner ? { id: owner.id, name: owner.name } : null,
  };
}

function groupTasksByStatus(tasks) {
  return STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((item) => item.status === status),
  }));
}

function emptyDraft() {
  return {
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    ownerId: "",
  };
}

function emptyHandoff() {
  return { ownerId: "" };
}

function computeMetrics(project) {
  const taskCount = project.tasks.length;
  const staleCount = project.tasks.filter((item) => item.isStale).length;
  const overdueCount = project.tasks.filter((item) => isOverdueTask(item)).length;
  return { taskCount, staleCount, overdueCount };
}

export default function DemoBoardPage() {
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState("p4");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showHandoffForm, setShowHandoffForm] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());
  const [handoffForm, setHandoffForm] = useState(emptyHandoff());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasUsedAI, setHasUsedAI] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiCreated, setAiCreated] = useState([]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || projects[0] || null,
    [projects, selectedProjectId],
  );

  const selectedTask = useMemo(
    () => selectedProject?.tasks.find((item) => String(item.id) === String(selectedTaskId)) || null,
    [selectedProject, selectedTaskId],
  );

  const projectSummary = useMemo(() => {
    if (!selectedProject) return { taskCount: 0, staleCount: 0, overdueCount: 0 };
    return summarizeProject(selectedProject);
  }, [selectedProject]);

  const groupedTasks = useMemo(() => {
    if (!selectedProject) return [];
    return groupTasksByStatus(selectedProject.tasks);
  }, [selectedProject]);

  const groupedProjects = useMemo(() => {
    const byStatus = new Map();
    projects.forEach((project) => {
      if (!byStatus.has(project.status)) byStatus.set(project.status, []);
      byStatus.get(project.status).push(project);
    });

    return Array.from(byStatus.entries()).map(([status, list]) => ({ status, list }));
  }, [projects]);

  function patchProject(projectId, updater) {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project;
        return updater(project);
      }),
    );
  }

  function updateTask(taskId, updates) {
    if (!selectedProject) return;

    patchProject(selectedProject.id, (project) => ({
      ...project,
      tasks: project.tasks.map((item) => (String(item.id) === String(taskId) ? { ...item, ...updates } : item)),
    }));
  }

  function handleDragStart(event) {
    const task = event.active.data.current?.task;
    if (task) setActiveTask(task);
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  function handleDragEnd(event) {
    setActiveTask(null);
    const { active, over } = event;
    if (!selectedProject || !over) return;

    const nextStatus = String(over.id || "").toUpperCase();
    if (!STATUSES.includes(nextStatus)) return;

    const prevStatus = String(active.data.current?.status || "").toUpperCase();
    if (prevStatus === nextStatus) return;

    updateTask(active.id, { status: nextStatus });
  }

  function handleCreateTask(event) {
    event.preventDefault();
    if (!selectedProject || !draft.title.trim()) return;

    const owner = DEMO_USERS.find((user) => user.id === draft.ownerId);

    const newTask = {
      id: `task-${Date.now()}`,
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: draft.status,
      dueDate: draft.dueDate || null,
      priority: draft.priority,
      isStale: false,
      owner: owner ? { id: owner.id, name: owner.name } : null,
    };

    patchProject(selectedProject.id, (project) => ({
      ...project,
      tasks: [...project.tasks, newTask],
    }));

    setDraft(emptyDraft());
    setShowAddTaskForm(false);
  }

  function handleHandoff(event) {
    event.preventDefault();
    if (!selectedProject || !handoffForm.ownerId) return;

    const owner = DEMO_USERS.find((user) => user.id === handoffForm.ownerId);
    if (!owner) return;

    patchProject(selectedProject.id, (project) => ({
      ...project,
      owner: { id: owner.id, username: owner.name },
      team: { name: owner.team },
    }));

    setHandoffForm(emptyHandoff());
    setShowHandoffForm(false);
  }

  function openAiDrawer() {
    setDrawerOpen(true);
  }

  function handleGenerateFromAi(event) {
    event.preventDefault();
    setHasUsedAI(true);
    setAiCreated(MOCK_AI_RESPONSE.created);
  }

  function handleConfirmAiTasks() {
    const aiTasks = aiCreated.map((item) => {
      const owner = DEMO_USERS.find((user) => user.name === item.owner);
      return {
        id: item.id,
        title: item.title,
        description: "Created from AI demo input",
        status: item.status,
        priority: "MEDIUM",
        dueDate: null,
        isStale: false,
        owner: owner ? { id: owner.id, name: owner.name } : null,
      };
    });

    patchProject("p4", (project) => ({
      ...project,
      tasks: [...project.tasks, ...aiTasks],
    }));

    setHasUsedAI(true);
    setAiCreated([]);
    setAiInput("");
    setDrawerOpen(false);
    setSelectedProjectId("p4");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface, #f8fafc)", color: "var(--text-primary, #0f172a)", fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div
        style={{
          background: "#dbeafe",
          borderBottom: "1px solid #bfdbfe",
          color: "#1e3a8a",
          padding: "10px 16px",
          fontSize: 14,
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>You&apos;re viewing a live demo. Sign up to connect your team.</span>
        <Link to="/register" style={{ color: "#1d4ed8", fontWeight: 700, textDecoration: "none" }}>
          Get started
        </Link>
      </div>

      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Accord Demo</h1>
          <p style={{ color: "#64748b" }}>Explore ownership, handoffs, and accountability workflows.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button type="button" onClick={openAiDrawer} className="btn-primary" style={{ background: "#1d4ed8", borderColor: "#1d4ed8", color: "#fff" }}>
            AI task creation
          </button>
          <Link to="/" className="btn-ghost" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Back to home
          </Link>
        </div>
      </header>

      <main style={{ display: "grid", gridTemplateColumns: "minmax(300px, 420px) minmax(0, 1fr)", gap: 16, padding: 16 }}>
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: 14 }}>
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>Projects</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {groupedProjects.map((group) => (
              <div key={group.status}>
                <p style={{ marginBottom: 6, color: "#64748b", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em" }}>{group.status.replaceAll("_", " ")}</p>
                <div style={{ display: "grid", gap: 8 }}>
                  {group.list.map((project) => {
                    const metrics = computeMetrics(project);
                    const active = project.id === selectedProject?.id;

                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setSelectedTaskId(null);
                        }}
                        style={{
                          border: active ? "1px solid #1d4ed8" : "1px solid #e2e8f0",
                          background: active ? "#eff6ff" : "#fff",
                          borderRadius: 12,
                          padding: 11,
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <p style={{ fontWeight: 700, marginBottom: 4 }}>{project.title}</p>
                        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 7 }}>
                          Owner: {project.owner.username} | Team: {project.team.name}
                        </p>
                        <p style={{ color: "#64748b", fontSize: 12 }}>
                          Due {formatDate(project.dueDate)} | Tasks {metrics.taskCount} | Overdue {metrics.overdueCount} | Stale {metrics.staleCount}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: 14 }}>
          {!selectedProject ? (
            <p style={{ color: "#64748b" }}>No project selected.</p>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontSize: 21 }}>{selectedProject.title}</h2>
                  <p style={{ color: "#64748b" }}>{selectedProject.team.name} | Owner {selectedProject.owner.username}</p>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" className="btn-primary" style={{ background: "#1d4ed8", borderColor: "#1d4ed8", color: "#fff" }} onClick={() => setShowAddTaskForm((value) => !value)}>
                    {showAddTaskForm ? "Close task form" : "Add task"}
                  </button>
                  <button type="button" className="btn-primary" style={{ background: "#1d4ed8", borderColor: "#1d4ed8", color: "#fff" }} onClick={() => setShowHandoffForm((value) => !value)}>
                    {showHandoffForm ? "Close handoff form" : "Handoff"}
                  </button>
                </div>
              </div>

              <section style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, marginBottom: 12, background: "#f8fafc" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8 }}>
                  <Metric label="Status" value={selectedProject.status.replaceAll("_", " ")} />
                  <Metric label="Due" value={formatDate(selectedProject.dueDate)} />
                  <Metric label="Tasks" value={String(projectSummary.taskCount)} />
                  <Metric label="Overdue" value={String(projectSummary.overdueCount)} />
                  <Metric label="Stale" value={String(projectSummary.staleCount)} />
                </div>
              </section>

              {showAddTaskForm && (
                <form onSubmit={handleCreateTask} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, marginBottom: 12, display: "grid", gap: 8 }}>
                  <h3 style={{ marginBottom: 4 }}>New task</h3>
                  <input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Task title" />
                  <textarea rows={3} value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Task description" />
                  <label>
                    Status
                    <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
                      {COLUMNS.map((column) => (
                        <option key={column.status} value={column.status}>{column.label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Priority
                    <select value={draft.priority} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))}>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </label>
                  <label>
                    Due date
                    <input type="date" value={draft.dueDate} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} />
                  </label>
                  <label>
                    Owner
                    <select value={draft.ownerId} onChange={(event) => setDraft((current) => ({ ...current, ownerId: event.target.value }))}>
                      <option value="">Select owner</option>
                      {DEMO_USERS.map((user) => (
                        <option key={user.id} value={user.id}>{user.name} ({user.team})</option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="btn-primary" style={{ width: "fit-content", background: "#1d4ed8", borderColor: "#1d4ed8", color: "#fff" }}>
                    Create task
                  </button>
                </form>
              )}

              {showHandoffForm && (
                <form onSubmit={handleHandoff} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, marginBottom: 12, display: "grid", gap: 8 }}>
                  <h3 style={{ marginBottom: 4 }}>Hand off project owner</h3>
                  <label>
                    New owner
                    <select value={handoffForm.ownerId} onChange={(event) => setHandoffForm({ ownerId: event.target.value })}>
                      <option value="">Select owner</option>
                      {DEMO_USERS.map((user) => (
                        <option key={user.id} value={user.id}>{user.name} ({user.team})</option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="btn-primary" style={{ width: "fit-content", background: "#1d4ed8", borderColor: "#1d4ed8", color: "#fff" }}>
                    Hand off project
                  </button>
                </form>
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  {groupedTasks.map(({ status, tasks }) => (
                    <KanbanColumn
                      key={status}
                      status={status}
                      label={COLUMNS.find((item) => item.status === status)?.label || status}
                      tasks={tasks}
                      droppableId={status}
                      projectId={selectedProject.id}
                      onSelectTask={(taskItem) => setSelectedTaskId(taskItem.id)}
                    />
                  ))}
                </div>
                <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
              </DndContext>
            </>
          )}
        </section>
      </main>

      {selectedTask && selectedProject && (
        <TaskDetailPanel
          task={selectedTask}
          project={selectedProject}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={(updates) => updateTask(selectedTask.id, updates)}
        />
      )}

      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 20 }}>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.45)" }} />
          <aside style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(100%, 480px)", background: "#fff", borderLeft: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: 18, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <h2 style={{ margin: 0 }}>AI Task Creation</h2>
              <button type="button" className="btn-ghost" onClick={() => setDrawerOpen(false)}>Close</button>
            </div>

            {!hasUsedAI ? (
              <>
                <p style={{ color: "#64748b", marginBottom: 10 }}>Paste any project note and generate suggested tasks for Digital Wallet Launch.</p>
                <form onSubmit={handleGenerateFromAi}>
                  <textarea
                    rows={8}
                    value={aiInput}
                    onChange={(event) => setAiInput(event.target.value)}
                    placeholder="Paste an email, Slack thread, or short brief..."
                    style={{ marginBottom: 10 }}
                  />
                  <button type="submit" className="btn-primary" style={{ background: "#1d4ed8", borderColor: "#1d4ed8", color: "#fff" }} disabled={!aiInput.trim()}>
                    Generate tasks
                  </button>
                </form>

                {aiCreated.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <h3 style={{ marginBottom: 8 }}>Suggested tasks</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 7 }}>
                      {aiCreated.map((item) => (
                        <li key={item.id}>
                          <strong>{item.title}</strong>
                          <span style={{ color: "#64748b" }}>
                            {" "}- {item.owner ? `Owner: ${item.owner}` : "Owner unresolved"}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ marginTop: 12, background: "#1d4ed8", borderColor: "#1d4ed8", color: "#fff" }}
                      onClick={handleConfirmAiTasks}
                    >
                      Confirm and add to Digital Wallet Launch
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", color: "#1e3a8a", borderRadius: 10, padding: 12 }}>
                AI input has been used for this demo session.
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", background: "#fff" }}>
      <p style={{ color: "#64748b", fontSize: 12, marginBottom: 2 }}>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
