import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DroppableList from "./DroppableList";
import SortableTaskCard from "./SortableTaskCard";
import useBoardStore from "../../store/useBoardStore";

const BoardColumn = ({ list, tasks, boardId }) => {
  const { handleDeleteList, setDefaultListId, setEditTask, setShowForm, handleDelete } =
    useBoardStore();

  return (
    <div
      className="w-72 shrink-0 rounded-xl border flex flex-col transition-colors"
      style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <h3
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: "var(--text-primary)" }}
          >
            {list.name}
          </h3>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold"
            style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => handleDeleteList(list.id, boardId)}
          className="p-1 text-red-400 transition-colors opacity-0 hover:opacity-100"
        >
          <span className="material-symbols-outlined text-[14px]">delete</span>
        </button>
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
