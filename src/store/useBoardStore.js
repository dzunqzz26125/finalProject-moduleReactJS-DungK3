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
    const id = Number(boardId);
    const [boardRes, listsRes, tasksRes] = await Promise.all([
      api.get(`/boards/${id}`),
      api.get("/lists", { params: { boardId: id } }),
      api.get("/tasks", { params: { boardId: id } }),
    ]);
    set({
      board: boardRes.data,
      lists: listsRes.data.sort((a, b) => a.order - b.order),
    });
    useTaskStore.getState().setTasks(tasksRes.data);
  },

  addList: async (name, boardId) => {
    const res = await api.post("/lists", { name, boardId: Number(boardId) });
    set((state) => ({ lists: [...state.lists, res.data] }));
  },

  renameList: async (listId, name) => {
    if (!name.trim()) return;
    await api.patch(`/lists/${listId}`, { name: name.trim() });
    set((state) => ({
      lists: state.lists.map((l) => (l.id === listId ? { ...l, name: name.trim() } : l)),
    }));
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
