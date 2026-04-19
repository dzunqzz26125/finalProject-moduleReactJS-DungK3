import { create } from "zustand";

const useUIStore = create((set) => ({
  searchQuery: "",
  filterPriority: "all",
  showForm: false,

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterPriority: (p) => set({ filterPriority: p }),
  setShowForm: (v) => set({ showForm: v }),
}));

export default useUIStore;
