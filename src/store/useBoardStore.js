import { create } from "zustand";
import api from "../mock/api";
import useTaskStore from "./useTaskStore";

const useBoardStore = create((set, get) => ({
  board: null,
  lists: [],
  showForm: false,
  editTask: null,
  detailTask: null,
  defaultListId: null,
  searchQuery: "",
  filterPriority: "all",

  setShowForm: (v) => set({ showForm: v }),
  setEditTask: (t) => set({ editTask: t }),
  setDetailTask: (t) => set({ detailTask: t }),
  setDefaultListId: (id) => set({ defaultListId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterPriority: (p) => set({ filterPriority: p }),

  fetchBoard: async (boardId) => {
    const [boardRes, listsRes, tasksRes] = await Promise.all([
      api.get(`/boards/${boardId}`),
      api.get("/lists", { params: { boardId } }),
      api.get("/tasks", { params: { boardId } }),
    ]);
    set({
      board: boardRes.data,
      lists: listsRes.data.sort((a, b) => a.order - b.order),
    });
    useTaskStore.getState().setTasks(tasksRes.data);
  },

  addList: async (name, boardId) => {
    const res = await api.post("/lists", { name, boardId });
    set((state) => ({ lists: [...state.lists, res.data] }));
  },

  handleDeleteList: async (listId) => {
    set((state) => ({ lists: state.lists.filter((l) => l.id !== listId) }));
    await api.delete(`/lists/${listId}`);
  },

  handleDelete: async (taskId) => {
    await useTaskStore.getState().deleteTask(taskId);
  },
}));

export default useBoardStore;
