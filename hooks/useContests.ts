import { useEffect } from "react";
import { useContestStore } from "../store/contestStore";
import { fetchContests } from "../lib/api";

export function useContests() {
  const {
    contests,
    filteredContests,
    filters,
    viewMode,
    isLoading,
    error,
    setContests,
    setLoading,
    setError,
    setFilters,
    setViewMode,
  } = useContestStore();

  useEffect(() => {
    async function load() {
      if (contests.length > 0) return; // Already loaded

      setLoading(true);
      try {
        const data = await fetchContests();
        setContests(data);
      } catch (err) {
        setError("Failed to fetch contests");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [contests.length, setContests, setLoading, setError]);

  return {
    contests: filteredContests,
    allContests: contests,
    filters,
    viewMode,
    isLoading,
    error,
    setFilters,
    setViewMode,
    refresh: async () => {
        setLoading(true);
        const data = await fetchContests();
        setContests(data);
        setLoading(false);
    }
  };
}
