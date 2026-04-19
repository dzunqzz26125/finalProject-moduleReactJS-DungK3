import React, { useState, useRef } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DroppableList from "./DroppableList";
import SortableTaskCard from "./SortableTaskCard";
import useBoardStore from "../../store/useBoardStore";

const BoardColumn = ({ list, tasks, boardId }) => {
  const { handleDeleteList, setDefaultListId, setEditTask, setShowForm, handleDelete, renameList } =
    useBoardStore();
  const [editing, setEditing] = useState(false);
  const [nameVal, setNameVal] = useState(list.name);
  const inputRef = useRef(null);

  const startEdit = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitRename = () => {
    setEditing(false);
    if (nameVal.trim() && nameVal.trim() !== list.name) {
      renameList(list.id, nameVal);
    } else {
      setNameVal(list.name);
    }
  };

  return (
    <div
      className="w-72 shrink-0 rounded-xl border flex flex-col transition-colors"
      style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b group"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") { setEditing(false); setNameVal(list.name); } }}
              className="text-sm font-bold uppercase tracking-wide bg-transparent border-b outline-none w-full"
              style={{ color: "var(--text-primary)", borderColor: "var(--accent)" }}
            />
          ) : (
            <h3
              className="text-sm font-bold uppercase tracking-wide cursor-pointer hover:opacity-70 truncate"
              style={{ color: "var(--text-primary)" }}
              onClick={startEdit}
              title="Click to rename"
            >
              {list.name}
            </h3>
          )}
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0"
            style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}
          >
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={startEdit}
            className="p-1 transition-colors"
            style={{ color: "var(--text-muted)" }}
            title="Rename"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
          <button
            onClick={() => handleDeleteList(list.id, boardId)}
            className="p-1 text-red-400 transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </button>
        </div>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <DroppableList listId={list.id}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={(t) => { setEditTask(t); setShowForm(true); }}
              onDelete={(id) => handleDelete(id, boardId)}
              onClick={(t) => useBoardStore.getState().setDetailTask(t)}
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
};

export default BoardColumn;
