import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import api from "../mock/api";
import TaskForm from "./TaskForm";
import TaskDetail from "../components/TaskDetail";

const LIST_STATUS_MAP = {
  "todo": "todo", "to do": "todo",
  "in progress": "in_progress", "inprogress": "in_progress",
  "review": "review",
  "done": "done",
};

const DroppableList = ({ listId, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `list-${listId}` });
  return (
    <div
      ref={setNodeRef}
      className={`p-3 flex flex-col gap-2 min-h-[60px] rounded-lg transition-colors ${isOver ? "bg-[#CCFF00]/5" : ""}`}
    >
      {children}
    </div>
  );
};

const PRIORITY_COLORS = { low: "text-green-400", medium: "text-yellow-400", high: "text-orange-400", critical: "text-red-400" };
const LABEL_COLORS = { blue: "bg-blue-500", green: "bg-green-500", red: "bg-red-500", yellow: "bg-yellow-500", purple: "bg-purple-500", pink: "bg-pink-500" };

const SortableTaskCard = ({ task, onEdit, onDelete, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      {...attributes}
      {...listeners}
      className="p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all group"
      onClick={() => onClick(task)}
    >
      {task.labels?.length > 0 && (
        <div className="flex gap-1 mb-2">
          {task.labels.map((l) => (
            <span key={l} className={`h-1.5 w-8 rounded-full ${LABEL_COLORS[l] || "bg-gray-500"}`} />
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug flex-1" style={{ color: "var(--text-primary)" }}>{task.title}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(task)} className="p-1 transition-colors" style={{ color: "var(--text-muted)" }}>
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1 text-red-400 transition-colors">
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </button>
        </div>
      </div>
      {task.tags && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.split(",").map((t) => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 border uppercase tracking-wider font-bold" style={{ backgroundColor: "var(--accent)" + "1a", color: "var(--accent)", borderColor: "var(--accent)" + "33" }}>{t.trim()}</span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 mt-2" style={{ color: "var(--text-muted)" }}>
        {task.deadline && (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">schedule</span>
            <span className="text-[10px]">{task.deadline}</span>
          </div>
        )}
        {task.checklist?.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">checklist</span>
            <span className="text-[10px]">{task.checklist.filter((c) => c.done).length}/{task.checklist.length}</span>
          </div>
        )}
        {task.priority && (
          <span className={`text-[10px] font-bold uppercase ml-auto ${PRIORITY_COLORS[task.priority] || ""}`}>{task.priority}</span>
        )}
      </div>
      {task.assignees?.length > 0 && (
        <div className="flex gap-1 mt-2">
          {task.assignees.slice(0, 3).map((a) => (
            <div key={a} className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }} title={a}>
              {a[0].toUpperCase()}
            </div>
          ))}
          {task.assignees.length > 3 && <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>+{task.assignees.length - 3}</span>}
        </div>
      )}
    </div>
  );
};

const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [defaultListId, setDefaultListId] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [addingList, setAddingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [activeTask, setActiveTask] = useState(null);
  const tasksRef = useRef(tasks);
  const listsRef = useRef(lists);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);
  useEffect(() => { listsRef.current = lists; }, [lists]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const fetchData = useCallback(async () => {
    const [boardRes, listsRes, tasksRes] = await Promise.all([
      api.get(`/boards/${boardId}`),
      api.get("/lists", { params: { boardId } }),
      api.get("/tasks", { params: { boardId } }),
    ]);
    setBoard(boardRes.data);
    setLists(listsRes.data.sort((a, b) => a.order - b.order));
    setTasks(tasksRes.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
  }, [boardId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete task?")) return;
    await api.delete(`/tasks/${id}`);
    fetchData();
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const maxOrder = lists.reduce((m, l) => Math.max(m, l.order), -1);
    await api.post("/lists", { boardId: Number(boardId), name: newListName.trim(), order: maxOrder + 1 });
    setNewListName("");
    setAddingList(false);
    fetchData();
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm("Delete this list and all its tasks?")) return;
    const listTasks = tasks.filter((t) => t.listId === listId);
    await Promise.all(listTasks.map((t) => api.delete(`/tasks/${t.id}`)));
    await api.delete(`/lists/${listId}`);
    fetchData();
  };

  const handleDragStart = (event) => {
    setActiveTask(tasksRef.current.find((t) => t.id === event.active.id) || null);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const current = tasksRef.current;
    const dragged = current.find((t) => t.id === active.id);
    if (!dragged) return;

    const overId = over.id.toString();
    const targetListId = overId.startsWith("list-")
      ? Number(overId.replace("list-", ""))
      : current.find((t) => t.id === over.id)?.listId;

    if (targetListId && dragged.listId !== targetListId) {
      setTasks((prev) =>
        prev.map((t) => t.id === dragged.id ? { ...t, listId: targetListId } : t)
      );
    }
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const current = tasksRef.current;
    const dragged = current.find((t) => t.id === active.id);
    if (!dragged) return;

    const overId = over.id.toString();
    const targetListId = overId.startsWith("list-")
      ? Number(overId.replace("list-", ""))
      : current.find((t) => t.id === over.id)?.listId ?? dragged.listId;

    const targetList = listsRef.current.find((l) => l.id === targetListId);
    const newStatus = LIST_STATUS_MAP[(targetList?.name || "").toLowerCase()] || dragged.status;
    const user = JSON.parse(localStorage.getItem("users") || "{}");

    if (dragged.listId !== targetListId || dragged.status !== newStatus) {
      await api.patch(`/tasks/${dragged.id}`, { listId: targetListId, status: newStatus });
      await api.post("/activities", {
        taskId: dragged.id,
        userId: user.id,
        userName: user.name,
        action: `moved task to ${targetList?.name}`,
        createdAt: new Date().toISOString(),
      });
    } else if (active.id !== over.id) {
      const listTasks = current
        .filter((t) => t.listId === targetListId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      const oldIdx = listTasks.findIndex((t) => t.id === active.id);
      const newIdx = listTasks.findIndex((t) => t.id === over.id);
      if (oldIdx !== -1 && newIdx !== -1) {
        const reordered = arrayMove(listTasks, oldIdx, newIdx);
        await Promise.all(reordered.map((t, i) => api.patch(`/tasks/${t.id}`, { order: i })));
      }
    }
    fetchData();
  };

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignees || []).some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.tags || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  if (!board) return <div className="ml-64 pt-20 p-8" style={{ color: "var(--text-muted)" }}>Loading...</div>;

  return (
    <div className="ml-64 pt-16 min-h-screen transition-colors" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="px-8 py-4 border-b flex items-center gap-4 flex-wrap" style={{ backgroundColor: board.color + "22", borderColor: "var(--border)" }}>
        <button onClick={() => navigate("/app/workspaces")} className="transition-colors" style={{ color: "var(--text-muted)" }}>
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter font-['Space_Grotesk']" style={{ color: "var(--text-primary)" }}>{board.name}</h1>
        <span className="text-[10px] border px-2 py-1 font-bold uppercase" style={{ backgroundColor: "var(--accent)" + "1a", color: "var(--accent)", borderColor: "var(--accent)" + "33" }}>{tasks.length} tasks</span>
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[14px]" style={{ color: "var(--text-muted)" }}>search</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border focus:ring-0 pl-7 pr-3 py-1.5 text-xs placeholder:opacity-40 w-40 transition-colors"
              style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border focus:ring-0 px-2 py-1.5 text-xs uppercase transition-colors"
            style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Board Content */}
      <div className="p-6 overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 items-start min-w-max">
            {lists.map((list) => {
              const listTasks = filteredTasks.filter((t) => t.listId === list.id).sort((a, b) => (a.order || 0) - (b.order || 0));
              return (
                <div key={list.id} className="w-72 shrink-0 rounded-xl border flex flex-col transition-colors" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--text-primary)" }}>{list.name}</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}>{listTasks.length}</span>
                    </div>
                    <button onClick={() => handleDeleteList(list.id)} className="p-1 text-red-400 transition-colors opacity-0 hover:opacity-100">
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </div>
                  <SortableContext items={listTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <DroppableList listId={list.id}>
                      {listTasks.map((task) => (
                        <SortableTaskCard
                          key={task.id}
                          task={task}
                          onEdit={(t) => { setEditTask(t); setShowForm(true); }}
                          onDelete={handleDelete}
                          onClick={setDetailTask}
                        />
                      ))}
                    </DroppableList>
                  </SortableContext>
                  <button
                    onClick={() => { setDefaultListId(list.id); setEditTask(null); setShowForm(true); }}
                    className="mx-3 mb-3 py-2 flex items-center justify-center gap-1 rounded-lg transition-all text-xs font-medium border border-dashed"
                    style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Add card
                  </button>
                </div>
              );
            })}

            <div className="w-72 shrink-0">
              {addingList ? (
                <form onSubmit={handleAddList} className="rounded-xl border p-3 space-y-2" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--accent)" + "4d" }}>
                  <input
                    autoFocus
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full border px-3 py-2 text-sm focus:ring-0 transition-colors"
                    style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                    placeholder="List name..."
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-1.5 text-xs font-black uppercase transition-colors" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>Add</button>
                    <button type="button" onClick={() => setAddingList(false)} className="px-3 transition-colors" style={{ color: "var(--text-muted)" }}>
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setAddingList(true)}
                  className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed transition-all text-sm font-medium"
                  style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add list
                </button>
              )}
            </div>
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="bg-[#131313] p-3 rounded-lg border border-[#CCFF00]/50 shadow-[0_0_20px_rgba(204,255,0,0.2)] w-72 rotate-2">
                <p className="text-[#E5E2E1] text-sm font-medium">{activeTask.title}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {showForm && (
        <TaskForm
          onClose={() => { setShowForm(false); setEditTask(null); fetchData(); }}
          task={editTask}
          defaultListId={defaultListId}
          boardId={Number(boardId)}
        />
      )}
      {detailTask && (
        <TaskDetail
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={(t) => { setDetailTask(null); setEditTask(t); setShowForm(true); }}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
};

export default BoardDetail;
