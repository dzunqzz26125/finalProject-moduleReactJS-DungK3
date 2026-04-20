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
export { DroppableColumn, SortableTaskCard };
import { useDroppable, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  LABEL_COLORS,
  PRIORITY_COLORS,
  STATUS_OPTIONS,
} from "../../constants/taskConstants";
import { useEffect, useRef, useState } from "react";
