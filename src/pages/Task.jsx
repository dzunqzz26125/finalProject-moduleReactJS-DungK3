import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskForm from "./TaskForm";
import TaskDetail from "../components/TaskDetail";
import api from "../mock/api";

const COLUMNS = [
  { status: "todo", label: "To Do", color: "border-blue-400" },
  { status: "in_progress", label: "In Progress", color: "border-yellow-400" },
  { status: "review", label: "Review", color: "border-purple-400" },
  { status: "done", label: "Done", color: "border-green-400" },
];

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

const PRIORITY_COLORS = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-orange-500",
  critical: "text-red-500",
};

const LABEL_COLORS = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
};

const DroppableColumn = ({ status, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${status}` });
  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-2 min-h-[60px] rounded-lg transition-colors"
      style={{ backgroundColor: isOver ? "var(--accent)1a" : "transparent" }}
    >
      {children}
    </div>
  );
};

const SortableTaskCard = ({
  item,
  onEdit,
  onDelete,
  onStatusChange,
  onClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { type: "task", status: item.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
      className="p-4 rounded-xl shadow-sm border relative group transition-colors"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 hover:!opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
        style={{ color: "var(--text-muted)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="material-symbols-outlined text-[16px]">
          drag_indicator
        </span>
      </div>

      <div className="pl-4" onClick={() => onClick(item)}>
        {item.labels?.length > 0 && (
          <div className="flex gap-1 mb-2">
            {item.labels.map((l) => (
              <span
                key={l}
                className={`h-1.5 w-8 rounded-full ${LABEL_COLORS[l] || "bg-gray-500"}`}
              />
            ))}
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <h4
            className="text-sm font-medium mb-2 leading-snug flex-1"
            style={{ color: "var(--text-primary)" }}
          >
            {item.title}
          </h4>
          <div
            ref={menuRef}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="material-symbols-outlined text-[18px]">
                more_vert
              </span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-8 border min-w-40 z-20 shadow-lg"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="py-1 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p
                    className="px-3 py-1 text-[9px] uppercase tracking-widest font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Move to
                  </p>
                  {STATUS_OPTIONS.filter((s) => s.value !== item.status).map(
                    (s) => (
                      <button
                        key={s.value}
                        onClick={() => {
                          onStatusChange(item, s.value);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-['Space_Grotesk'] uppercase tracking-wider transition-colors"
                        style={{ color: "var(--text-primary)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--accent)";
                          e.currentTarget.style.backgroundColor =
                            "var(--bg-hover)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-primary)";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {s.label}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={() => {
                    onEdit(item);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-['Space_Grotesk'] uppercase tracking-wider transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent)";
                    e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-primary)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    edit
                  </span>
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(item.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 font-['Space_Grotesk'] uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    delete
                  </span>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {item.description && (
          <p
            className="text-xs mb-3 leading-relaxed line-clamp-2"
            style={{ color: "var(--text-muted)" }}
          >
            {item.description}
          </p>
        )}

        {item.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.split(",").map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-2 py-0.5 border uppercase tracking-wider font-bold"
                style={{
                  backgroundColor: "var(--accent)1a",
                  color: "var(--accent)",
                  borderColor: "var(--accent)33",
                }}
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div
          className="flex items-center gap-3 mt-3"
          style={{ color: "var(--text-muted)" }}
        >
          {item.deadline && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                schedule
              </span>
              <span className="text-[10px] font-bold">{item.deadline}</span>
            </div>
          )}
          {item.checklist?.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                checklist
              </span>
              <span className="text-[10px] font-bold">
                {item.checklist.filter((c) => c.done).length}/
                {item.checklist.length}
              </span>
            </div>
          )}
          {item.assignees?.length > 0 && (
            <div className="flex gap-1 ml-auto">
              {item.assignees.slice(0, 2).map((a) => (
                <div
                  key={a}
                  title={a}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-text)",
                  }}
                >
                  {a[0].toUpperCase()}
                </div>
              ))}
              {item.assignees.length > 2 && (
                <span
                  className="text-[10px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  +{item.assignees.length - 2}
                </span>
              )}
            </div>
          )}
          <span
            className={`text-[10px] font-bold uppercase ${item.assignees?.length > 0 ? "" : "ml-auto"} ${PRIORITY_COLORS[item.priority] || ""}`}
          >
            {item.priority}
          </span>
        </div>
      </div>
    </div>
  );
};

const Task = () => {
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [defaultStatus, setDefaultStatus] = useState("todo");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDeadline, setFilterDeadline] = useState("all");
  const [activeTask, setActiveTask] = useState(null);
  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const fetchTasks = () => {
    api.get("/tasks").then((res) => setTasks(res.data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleStatusChange = async (task, newStatus) => {
    await api.patch(`/tasks/${task.id}`, { status: newStatus });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };
  const handleAddCard = (status) => {
    setDefaultStatus(status);
    setEditTask(null);
    setShowForm(true);
  };
  const handleFormClose = () => {
    setShowForm(false);
    setEditTask(null);
    fetchTasks();
  };

  const handleDragStart = ({ active }) => {
    setActiveTask(tasksRef.current.find((t) => t.id === active.id) || null);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const current = tasksRef.current;
    const draggedTask = current.find((t) => t.id === active.id);
    if (!draggedTask) return;
    const overColStatus = over.id.toString().startsWith("col-")
      ? over.id.toString().replace("col-", "")
      : null;
    const overTask = current.find((t) => t.id === over.id);
    const targetStatus = overColStatus || overTask?.status;
    if (targetStatus && draggedTask.status !== targetStatus) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === draggedTask.id ? { ...t, status: targetStatus } : t,
        ),
      );
    }
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const current = tasksRef.current;
    const draggedTask = current.find((t) => t.id === active.id);
    if (!draggedTask) return;
    await api.patch(`/tasks/${draggedTask.id}`, { status: draggedTask.status });
    const overTask = current.find((t) => t.id === over.id);
    if (
      overTask &&
      active.id !== over.id &&
      draggedTask.status === overTask.status
    ) {
      const colTasks = current
        .filter((t) => t.status === draggedTask.status)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      const oldIdx = colTasks.findIndex((t) => t.id === active.id);
      const newIdx = colTasks.findIndex((t) => t.id === over.id);
      if (oldIdx !== -1 && newIdx !== -1) {
        const reordered = arrayMove(colTasks, oldIdx, newIdx);
        setTasks([
          ...current.filter((t) => t.status !== draggedTask.status),
          ...reordered,
        ]);
        await Promise.all(
          reordered.map((t, i) => api.patch(`/tasks/${t.id}`, { order: i })),
        );
      }
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignees || []).some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      (t.tags || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority =
      filterPriority === "all" || t.priority === filterPriority;
    const matchDeadline =
      filterDeadline === "all" ||
      (filterDeadline === "overdue" &&
        t.deadline &&
        t.deadline < today &&
        t.status !== "done") ||
      (filterDeadline === "today" && t.deadline === today);
    return matchSearch && matchPriority && matchDeadline;
  });

  return (
    <div>
      <main
        className="ml-64 pt-20 p-8 min-h-screen transition-colors"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1
              className="text-xl font-bold tracking-tight font-['Space_Grotesk'] uppercase"
              style={{ color: "var(--text-primary)" }}
            >
              Project Board
            </h1>
            <span
              className="text-[10px] border px-2 py-1 font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "var(--accent)1a",
                color: "var(--accent)",
                borderColor: "var(--accent)33",
              }}
            >
              {tasks.length} tasks
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px]"
                style={{ color: "var(--text-muted)" }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border focus:ring-0 pl-9 pr-4 py-2 text-xs placeholder:opacity-50 w-48 transition-colors"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border focus:ring-0 px-3 py-2 text-xs uppercase transition-colors"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={filterDeadline}
              onChange={(e) => setFilterDeadline(e.target.value)}
              className="border focus:ring-0 px-3 py-2 text-xs uppercase transition-colors"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <option value="all">All Deadlines</option>
              <option value="today">Due Today</option>
              <option value="overdue">Overdue</option>
            </select>
            <button
              onClick={() => {
                setEditTask(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-text)",
              }}
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Task
            </button>
          </div>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-8 items-start">
            {COLUMNS.map(({ status, label, color }) => {
              const colTasks = filteredTasks
                .filter((t) => t.status === status)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
              return (
                <div key={status} className="w-80 shrink-0">
                  <div
                    className={`p-4 rounded-xl flex flex-col gap-3 border-t-2 ${color} transition-colors`}
                    style={{ backgroundColor: "var(--bg-elevated)" }}
                  >
                    <div className="flex items-center justify-between px-1">
                      <h3
                        className="text-sm font-bold uppercase tracking-wide"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {label}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          backgroundColor: "var(--bg-hover)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {colTasks.length}
                      </span>
                    </div>

                    <SortableContext
                      items={colTasks.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <DroppableColumn status={status}>
                        {colTasks.map((item) => (
                          <SortableTaskCard
                            key={item.id}
                            item={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                            onClick={setDetailTask}
                          />
                        ))}
                      </DroppableColumn>
                    </SortableContext>

                    <button
                      onClick={() => handleAddCard(status)}
                      className="w-full py-2 flex items-center justify-center gap-2 rounded-lg transition-colors text-xs font-medium"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--bg-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        add
                      </span>
                      Add a card
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
            {activeTask && (
              <div
                className="p-4 rounded-xl border-2 w-80 rotate-1 opacity-95 shadow-lg"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--accent)",
                }}
              >
                {activeTask.labels?.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {activeTask.labels.map((l) => (
                      <span
                        key={l}
                        className={`h-1.5 w-8 rounded-full ${LABEL_COLORS[l] || "bg-gray-500"}`}
                      />
                    ))}
                  </div>
                )}
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {activeTask.title}
                </p>
                {activeTask.priority && (
                  <span
                    className={`text-[10px] font-bold uppercase mt-2 block ${PRIORITY_COLORS[activeTask.priority] || ""}`}
                  >
                    {activeTask.priority}
                  </span>
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      {showForm && (
        <TaskForm
          onClose={handleFormClose}
          task={editTask}
          defaultStatus={defaultStatus}
        />
      )}

      {detailTask && (
        <TaskDetail
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={handleEdit}
          onRefresh={fetchTasks}
        />
      )}
    </div>
  );
};

export default Task;
