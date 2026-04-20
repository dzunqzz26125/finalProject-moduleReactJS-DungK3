import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import TaskForm from "../task/TaskForm";
import TaskDetail from "../../components/taskDetail/TaskDetail";
import BoardHeader from "../../components/board/BoardHeader";
import BoardColumn from "../../components/board/BoardColumn";

import useBoardStore from "../../store/useBoardStore";
import useTaskStore from "../../store/useTaskStore";

const BoardDetail = () => {
  const { boardId, workspaceId } = useParams();

  const { board, lists, fetchBoard, addList, showForm, editTask, detailTask, defaultListId, setShowForm, setEditTask, setDetailTask, searchQuery, filterPriority } = useBoardStore();
  const { activeTask, setActiveTask, getTasksByList, moveTaskLocal, reorderTasks } = useTaskStore();

  const getFilteredTasksByList = (listId) => {
    return getTasksByList(listId).filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.assignees || []).some((a) => a.toLowerCase().includes(q)) ||
        (t.tags || "").toLowerCase().includes(q);
      const matchPriority = filterPriority === "all" || t.priority === filterPriority;
      return matchSearch && matchPriority;
    });
  };

  useEffect(() => {
    fetchBoard(boardId);
    return () => {
      useBoardStore.getState().setSearchQuery("");
      useBoardStore.getState().setFilterPriority("all");
    };
  }, [boardId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (e) => {
    const task = useTaskStore.getState().tasksById[e.active.id];
    setActiveTask(task);
  };

  const handleDragOver = (e) => {
    const { active, over } = e;
    if (!over) return;
    const task = useTaskStore.getState().tasksById[active.id];
    const overId = over.id;
    const overTask = useTaskStore.getState().tasksById[overId];
    // over là DroppableList (id là số listId) hoặc task card
    const targetListId = typeof overId === "number" && !overTask
      ? overId
      : overTask?.listId;
    if (targetListId && task?.listId !== targetListId) {
      moveTaskLocal(task.id, targetListId);
    }
  };

  const handleDragEnd = async (e) => {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;
    const overId = over.id;
    const overTask = useTaskStore.getState().tasksById[overId];
    const targetListId = typeof overId === "number" && !overTask
      ? overId
      : overTask?.listId;
    await reorderTasks(targetListId, active.id, over.id);
  };

  const handleFormClose = async () => {
    setShowForm(false);
    setEditTask(null);
    await fetchBoard(boardId);
  };

  if (!board) return <div className="ml-64 pt-20 p-8">Loading...</div>;

  return (
    <div className="ml-64 pt-16 min-h-screen">
      <BoardHeader board={board} workspaceId={workspaceId} />

      <div className="p-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 items-start min-w-max">
            {lists.map((list) => (
              <BoardColumn key={list.id} list={list} tasks={getFilteredTasksByList(list.id)} boardId={boardId} />
            ))}
            <button
              onClick={() => addList("New List", boardId)}
              className="w-72 h-16 border-dashed border-2 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add List
            </button>
          </div>

          <DragOverlay>
            {activeTask && (
              <div
                className="p-3 rounded-lg border-2 w-72 rotate-1 shadow-lg"
                style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--accent)" }}
              >
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {activeTask.title}
                </p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {showForm && (
        <TaskForm
          task={editTask}
          defaultListId={defaultListId || lists[0]?.id}
          boardId={Number(boardId)}
          onClose={handleFormClose}
        />
      )}

      {detailTask && (
        <TaskDetail
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={(t) => { setDetailTask(null); setEditTask(t); setShowForm(true); }}
          onRefresh={() => fetchBoard(boardId)}
        />
      )}
    </div>
  );
};

export default BoardDetail;
