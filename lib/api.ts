import { Contest } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function fetchContests(): Promise<Contest[]> {
  const response = await fetch(`${API_BASE}/api/contests`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch contests");
  }

  const data: Contest[] = await response.json();
  return data;
}
