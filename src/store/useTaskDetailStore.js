import { create } from "zustand";
import api from "../mock/api";

const useTaskDetailStore = create((set, get) => ({
  comments: [],
  activities: [],
  checklist: [],
  files: [],
  newComment: "",
  newCheckItem: "",
  tab: "comments",

  setNewComment: (v) => set({ newComment: v }),
  setNewCheckItem: (v) => set({ newCheckItem: v }),
  setTab: (t) => set({ tab: t }),

  init: (task) => {
    set({ checklist: task.checklist || [], files: task.files || [] });
    Promise.all([
      api.get("/comments", { params: { taskId: task.id } }),
      api.get("/activities", { params: { taskId: task.id } }),
    ]).then(([cRes, aRes]) => {
      set({
        comments: cRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        activities: aRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      });
    });
  },

  refreshComments: async (taskId) => {
    const [cRes, aRes] = await Promise.all([
      api.get("/comments", { params: { taskId } }),
      api.get("/activities", { params: { taskId } }),
    ]);
    set({
      comments: cRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      activities: aRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  },

  addComment: async (task, onRefresh) => {
    const { newComment, refreshComments } = get();
    if (!newComment.trim()) return;
    const user = JSON.parse(localStorage.getItem("users") || "{}");
    await api.post("/comments", {
      taskId: task.id,
      userId: user.id,
      userName: user.name || user.email,
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    });
    await api.post("/activities", {
      taskId: task.id,
      userId: user.id,
      userName: user.name || user.email,
      action: "added a comment",
      createdAt: new Date().toISOString(),
    });
    set({ newComment: "" });
    await refreshComments(task.id);
    onRefresh?.();
  },

  toggleCheckItem: async (idx, task, onRefresh) => {
    const updated = get().checklist.map((c, i) =>
      i === idx ? { ...c, done: !c.done } : c
    );
    set({ checklist: updated });
    await api.patch(`/tasks/${task.id}`, { checklist: updated });
    onRefresh?.();
  },

  addCheckItem: async (task, onRefresh) => {
    const { newCheckItem, checklist } = get();
    if (!newCheckItem.trim()) return;
    const updated = [...checklist, { text: newCheckItem.trim(), done: false }];
    set({ checklist: updated, newCheckItem: "" });
    await api.patch(`/tasks/${task.id}`, { checklist: updated });
    onRefresh?.();
  },

  removeCheckItem: async (idx, task, onRefresh) => {
    const updated = get().checklist.filter((_, i) => i !== idx);
    set({ checklist: updated });
    await api.patch(`/tasks/${task.id}`, { checklist: updated });
    onRefresh?.();
  },

  handleFileUpload: async (file, task, onRefresh) => {
    if (!file) return;
    const user = JSON.parse(localStorage.getItem("users") || "{}");
    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.name || user.email,
    };
    const updated = [...get().files, fileData];
    set({ files: updated });
    await api.patch(`/tasks/${task.id}`, { files: updated });
    await api.post("/activities", {
      taskId: task.id,
      userId: user.id,
      userName: user.name || user.email,
      action: `attached file: ${file.name}`,
      createdAt: new Date().toISOString(),
    });
    onRefresh?.();
  },
}));

export default useTaskDetailStore;
