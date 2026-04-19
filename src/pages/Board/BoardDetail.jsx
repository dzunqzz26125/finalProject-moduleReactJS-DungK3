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

  const { board, lists, fetchBoard, addList, showForm, editTask, detailTask, defaultListId, setShowForm, setEditTask, setDetailTask } = useBoardStore();
  const { activeTask, setActiveTask, getTasksByList, moveTaskLocal, reorderTasks } = useTaskStore();

  useEffect(() => {
    fetchBoard(boardId);
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
    const targetListId = over.id.toString().startsWith("list-")
      ? Number(over.id.toString().replace("list-", ""))
      : useTaskStore.getState().tasksById[over.id]?.listId;
    if (targetListId && task?.listId !== targetListId) {
      moveTaskLocal(task.id, targetListId);
    }
  };

  const handleDragEnd = async (e) => {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;
    const overId = over.id.toString();
    const targetListId = overId.startsWith("list-")
      ? Number(overId.replace("list-", ""))
      : useTaskStore.getState().tasksById[over.id]?.listId;
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
              <BoardColumn key={list.id} list={list} tasks={getTasksByList(list.id)} boardId={boardId} />
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
          defaultListId={defaultListId}
          boardId={boardId}
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
