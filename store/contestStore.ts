import { create } from "zustand";
import { Contest, FilterState, ViewMode } from "../lib/types";

interface ContestStore {
  contests: Contest[];
  filteredContests: Contest[];
  filters: FilterState;
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;

  setContests: (contests: Contest[]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setViewMode: (mode: ViewMode) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  applyFilters: () => void;
}

export const useContestStore = create<ContestStore>((set, get) => ({
  contests: [],
  filteredContests: [],
  filters: {
    search: "",
    platforms: [],
    status: "all",
    startDate: null,
  },
  viewMode: "table",
  isLoading: false,
  error: null,

  setContests: (contests) => {
    set({ contests });
    get().applyFilters();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  applyFilters: () => {
    const { contests, filters } = get();
    let result = [...contests];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.platform.toLowerCase().includes(q)
      );
    }

    // Platforms
    if (filters.platforms.length > 0) {
      result = result.filter((c) => filters.platforms.includes(c.platform));
    }

    // Status
    if (filters.status !== "all") {
      result = result.filter((c) => c.status === filters.status);
    }

    // Date
    if (filters.startDate) {
        const filterDate = new Date(filters.startDate).setHours(0,0,0,0);
        result = result.filter(c => {
             const contestDate = new Date(c.startTime).setHours(0,0,0,0);
             return contestDate >= filterDate;
        });
    }

    set({ filteredContests: result });
  },
}));
