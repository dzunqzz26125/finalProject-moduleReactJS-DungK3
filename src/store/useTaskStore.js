import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import api from "../mock/api";

const useTaskStore = create((set, get) => ({
  tasksById: {},
  taskIds: [],
  activeTask: null,

  setActiveTask: (t) => set({ activeTask: t }),

  // ===== INIT =====
  setTasks: (tasks) => {
    const tasksById = {};
    const taskIds = [];

    tasks.forEach((t) => {
      tasksById[t.id] = t;
      taskIds.push(t.id);
    });

    set({ tasksById, taskIds });
  },

  // ===== SELECTOR =====
  getTasksByList: (listId) => {
    const { tasksById, taskIds } = get();
    return taskIds
      .map((id) => tasksById[id])
      .filter((t) => t.listId === listId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  // ===== DELETE (Optimistic) =====
  deleteTask: async (id) => {
    const prev = get().tasksById;

    set((state) => {
      const newTasks = { ...state.tasksById };
      delete newTasks[id];
      return {
        tasksById: newTasks,
        taskIds: state.taskIds.filter((i) => i !== id),
      };
    });

    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      set({ tasksById: prev }); // rollback
    }
  },

  // ===== UPDATE TASK =====
  updateTask: async (id, data) => {
    const prev = get().tasksById[id];

    set((state) => ({
      tasksById: {
        ...state.tasksById,
        [id]: { ...prev, ...data },
      },
    }));

    try {
      await api.patch(`/tasks/${id}`, data);
    } catch (err) {
      set((state) => ({
        tasksById: {
          ...state.tasksById,
          [id]: prev,
        },
      }));
    }
  },

  // ===== DRAG OVER (LOCAL ONLY) =====
  moveTaskLocal: (taskId, newListId) => {
    set((state) => ({
      tasksById: {
        ...state.tasksById,
        [taskId]: {
          ...state.tasksById[taskId],
          listId: newListId,
        },
      },
    }));
  },

  // ===== DRAG END =====
  reorderTasks: async (listId, activeId, overId) => {
    const tasks = get().getTasksByList(listId);

    const oldIdx = tasks.findIndex((t) => t.id === activeId);
    const newIdx = tasks.findIndex((t) => t.id === overId);

    if (oldIdx === -1 || newIdx === -1) return;

    const reordered = arrayMove(tasks, oldIdx, newIdx);

    // optimistic update
    set((state) => {
      const updated = { ...state.tasksById };
      reordered.forEach((t, i) => {
        updated[t.id] = { ...t, order: i };
      });
      return { tasksById: updated };
    });

    try {
      await api.patch("/tasks/reorder", reordered);
    } catch (err) {
      // fallback: refetch hoặc rollback (tuỳ bạn)
    }
  },
}));

export default useTaskStore;
