"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { UserProgress } from "@/types";
import { initialProgress } from "./progress";
import { progressRepository } from "./repository";
type Store = {
  progress: UserProgress;
  ready: boolean;
  error: string;
  update: (fn: (p: UserProgress) => UserProgress) => void;
};
const Context = createContext<Store | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(initialProgress),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  const current = useRef(initialProgress),
    blocked = useRef(false);
  useEffect(() => {
    try {
      current.current = progressRepository.load();
      setProgress(current.current);
    } catch (e) {
      blocked.current = true;
      setError((e as Error).message);
    }
    setReady(true);
  }, []);
  function update(fn: (p: UserProgress) => UserProgress) {
    if (blocked.current) return;
    const next = fn(current.current);
    try {
      progressRepository.save(next);
      setError("");
    } catch {
      setError(
        "Penyimpanan browser tidak tersedia. Progres sesi ini belum tersimpan; izinkan penyimpanan lalu coba lagi.",
      );
    }
    current.current = next;
    setProgress(next);
  }
  return (
    <Context.Provider value={{ progress, ready, error, update }}>
      {children}
    </Context.Provider>
  );
}
export function useProgress() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("ProgressProvider required");
  return ctx;
}
