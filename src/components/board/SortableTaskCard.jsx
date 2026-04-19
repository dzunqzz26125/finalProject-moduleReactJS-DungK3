import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LABEL_COLORS, PRIORITY_COLORS } from "../../constants/taskConstants";

const SortableTaskCard = ({ task, onEdit, onDelete, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

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
        <p className="text-sm font-medium leading-snug flex-1" style={{ color: "var(--text-primary)" }}>
          {task.title}
        </p>
        <div
          className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
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
            <span
              key={t}
              className="text-[9px] px-1.5 py-0.5 border uppercase tracking-wider font-bold"
              style={{
                backgroundColor: "var(--accent)" + "1a",
                color: "var(--accent)",
                borderColor: "var(--accent)" + "33",
              }}
            >
              {t.trim()}
            </span>
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
            <span className="text-[10px]">
              {task.checklist.filter((c) => c.done).length}/{task.checklist.length}
            </span>
          </div>
        )}
        {task.priority && (
          <span className={`text-[10px] font-bold uppercase ml-auto ${PRIORITY_COLORS[task.priority] || ""}`}>
            {task.priority}
          </span>
        )}
      </div>
      {task.assignees?.length > 0 && (
        <div className="flex gap-1 mt-2">
          {task.assignees.slice(0, 3).map((a) => (
            <div
              key={a}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
              title={a}
            >
              {a[0].toUpperCase()}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              +{task.assignees.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SortableTaskCard;
