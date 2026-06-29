import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useAuth } from "../context/AuthContext";
import { request } from "../api";
import { BOARD_BASE_URL } from "../config";
import { connectSSE } from "../sse";
import { COLUMNS, STATUSES, emptyTasksByStatus } from "../constants";
import KanbanColumn from "../components/KanbanColumn";
import AIDrawer from "../components/AIDrawer";
import TaskCard from "../components/TaskCard";

function resolveStatus(overId, tasksByStatus) {
  if (STATUSES.includes(overId)) return overId;
  for (const status of STATUSES) {
    if (tasksByStatus[status].some((t) => t.id === overId)) return status;
  }
  return null;
}

function applyTaskUpdate(prev, task) {
  const next = { ...prev };
  for (const status of STATUSES) {
    next[status] = next[status].filter((t) => t.id !== task.id);
  }
  const status = task.status;
  if (STATUSES.includes(status)) {
    next[status] = [...next[status], task];
  }
  return next;
}

export default function BoardPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tasksByStatus, setTasksByStatus] = useState(emptyTasksByStatus);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchAllTasks = useCallback(async () => {
    if (!user?.teamId) return;
    try {
      const results = await Promise.all(
        COLUMNS.map(({ status }) =>
          request(
            "GET",
            `${BOARD_BASE_URL}/tasks?status=${status}&teamId=${user.teamId}`,
          ),
        ),
      );
      const next = emptyTasksByStatus();
      COLUMNS.forEach(({ status }, i) => {
        next[status] = Array.isArray(results[i]) ? results[i] : [];
      });
      setTasksByStatus(next);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [user?.teamId]);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  useEffect(() => {
    if (!token) return;
    const disconnect = connectSSE(
      `${BOARD_BASE_URL}/updates/stream`,
      token,
      (event) => {
        const task = event.task || event;
        if (task?.id && task?.status) {
          setTasksByStatus((prev) => applyTaskUpdate(prev, task));
        }
      },
    );
    return disconnect;
  }, [token]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleDragStart(event) {
    const task = event.active.data.current?.task;
    if (task) setActiveTask(task);
  }

  async function handleDragEnd(event) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const oldStatus = active.data.current?.status;
    const newStatus = resolveStatus(over.id, tasksByStatus);
    if (!newStatus || oldStatus === newStatus) return;

    setTasksByStatus((prev) => {
      const task = prev[oldStatus]?.find((t) => t.id === taskId);
      if (!task) return prev;
      return {
        ...prev,
        [oldStatus]: prev[oldStatus].filter((t) => t.id !== taskId),
        [newStatus]: [...prev[newStatus], { ...task, status: newStatus }],
      };
    });

    try {
      await request("PATCH", `${BOARD_BASE_URL}/tasks/${taskId}`, {
        status: newStatus,
      });
    } catch {
      fetchAllTasks();
    }
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  function handleTasksCreated() {
    fetchAllTasks();
  }

  return (
    <div className="board-page">
      <header className="board-header">
        <h1 className="app-name">Project Board</h1>
        <div className="header-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <span className="user-name">{user?.name}</span>
          <button type="button" className="btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && <p className="board-error">{error}</p>}
      {loading ? (
        <p className="board-loading">Loading tasks…</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="kanban-board">
            {COLUMNS.map(({ status, label }) => (
              <KanbanColumn
                key={status}
                status={status}
                label={label}
                tasks={tasksByStatus[status]}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      <button
        type="button"
        className="fab"
        onClick={() => setDrawerOpen(true)}
        aria-label="Create tasks with AI"
      >
        +
      </button>

      <AIDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onTasksCreated={handleTasksCreated}
      />
    </div>
  );
}
