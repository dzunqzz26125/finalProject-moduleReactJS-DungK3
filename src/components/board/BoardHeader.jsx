import React from "react";
import { useNavigate } from "react-router-dom";
import useBoardStore from "../../store/useBoardStore";

const BoardHeader = ({ board, workspaceId }) => {
  const navigate = useNavigate();
  const { searchQuery, filterPriority, setSearchQuery, setFilterPriority, setShowForm, setEditTask } = useBoardStore();

  return (
    <div
      className="px-8 py-4 border-b flex items-center gap-4 flex-wrap"
      style={{ backgroundColor: board.color + "22", borderColor: "var(--border)" }}
    >
      <button
        onClick={() => navigate("/app/workspaces")}
        className="transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
      </button>
      <h1
        className="text-xl font-black uppercase tracking-tighter font-['Space_Grotesk']"
        style={{ color: "var(--text-primary)" }}
      >
        {board.name}
      </h1>
      <div className="flex items-center gap-3 ml-auto flex-wrap">
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[14px]"
            style={{ color: "var(--text-muted)" }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border focus:ring-0 pl-7 pr-3 py-1.5 text-xs placeholder:opacity-40 w-40 transition-colors"
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
          className="border focus:ring-0 px-2 py-1.5 text-xs uppercase transition-colors"
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
        <button
          onClick={() => { setEditTask(null); setShowForm(true); }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          New Task
        </button>
      </div>
    </div>
  );
};

export default BoardHeader;
