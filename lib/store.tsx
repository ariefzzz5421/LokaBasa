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
import { CloudProgressRepository } from "./cloud-repository";
import { validProgress } from "./repository";
import { useAuth } from "./auth";
type Store = {
  progress: UserProgress;
  ready: boolean;
  error: string;
  syncing: boolean;
  update: (fn: (p: UserProgress) => UserProgress) => void;
  retry: () => void;
};
const Context = createContext<Store | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(initialProgress),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [syncing, setSyncing] = useState(false),
    [reload, setReload] = useState(0);
  const current = useRef(initialProgress),
    repository = useRef<CloudProgressRepository | null>(null),
    blocked = useRef(true),
    generation = useRef(0),
    pending = useRef<UserProgress | null>(null),
    saving = useRef(false);
  const owner = user?.id;
  const [loadedOwner, setLoadedOwner] = useState<string | undefined>();
  useEffect(() => {
    const epoch = ++generation.current;
    repository.current = null;
    pending.current = null;
    saving.current = false;
    blocked.current = true;
    setReady(false);
    setError("");
    setSyncing(false);
    current.current = structuredClone(initialProgress);
    setProgress(current.current);
    setLoadedOwner(undefined);
    if (loading) return;
    if (!owner) {
      setReady(true);
      return;
    }
    const repo = new CloudProgressRepository(owner);
    repository.current = repo;
    const name =
      user?.user_metadata?.username ||
      user?.email?.split("@")[0] ||
      "Penjelajah";
    repo
      .load()
      .then((data) => {
        if (epoch !== generation.current) return;
        let value = data || {
          ...structuredClone(initialProgress),
          name,
          avatarId: Number(user?.user_metadata?.avatar_id) || 0,
        };
        let importedLegacy = false;
        if (!data) {
          try {
            const raw = localStorage.getItem("lokabasa.progress.v1");
            const claimed = localStorage.getItem("lokabasa.legacy-claimed-by");
            if (raw && !claimed) {
              const legacy = JSON.parse(raw);
              if (validProgress(legacy)) {
                value = {
                  ...legacy,
                  name: legacy.name || name,
                  avatarId: Number(user?.user_metadata?.avatar_id) || 0,
                };
                localStorage.setItem("lokabasa.legacy-claimed-by", owner);
                importedLegacy = true;
              }
            }
          } catch {
            /* Keep a clean new account if legacy data is unreadable. */
          }
        }
        let cacheError = "";
        try {
          const raw = localStorage.getItem(`lokabasa.pending.${owner}`);
          if (raw) {
            const draft = JSON.parse(raw);
            if (validProgress(draft.data)) {
              if (draft.revision === repo.revision) {
                value = draft.data;
                pending.current = value;
              } else
                cacheError =
                  "Ada salinan sesi yang belum tersinkron dan perubahan dari perangkat lain. Unduh salinan di profil sebelum menghapusnya.";
            }
          }
        } catch {
          cacheError =
            "Salinan perangkat tidak dapat dibaca. Progres akun berhasil dimuat.";
        }
        current.current = value;
        setProgress(value);
        blocked.current = false;
        setLoadedOwner(owner);
        setReady(true);
        setError(cacheError);
        if (importedLegacy) {
          pending.current = value;
          try {
            localStorage.setItem(
              `lokabasa.pending.${owner}`,
              JSON.stringify({ revision: repo.revision, data: value }),
            );
          } catch {}
        }
        if (pending.current) void flush();
      })
      .catch((e) => {
        if (epoch === generation.current) {
          setError(e.message);
          setLoadedOwner(owner);
          setReady(true);
        }
      });
    return () => {
      generation.current++;
    };
    // Identity changes must reset every cache and in-flight callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, loading, reload]);
  async function flush() {
    const repo = repository.current;
    if (!repo || blocked.current || saving.current || !pending.current) return;
    const epoch = generation.current;
    saving.current = true;
    setSyncing(true);
    try {
      while (pending.current && epoch === generation.current) {
        const draft = pending.current;
        pending.current = null;
        await repo.save(draft);
        if (epoch !== generation.current) return;
        try {
          if (pending.current)
            localStorage.setItem(
              `lokabasa.pending.${repo.userId}`,
              JSON.stringify({
                revision: repo.revision,
                data: pending.current,
              }),
            );
          else localStorage.removeItem(`lokabasa.pending.${repo.userId}`);
        } catch {
          setError(
            "Progres akun tersimpan; penyimpanan perangkat tidak tersedia.",
          );
        }
      }
      if (epoch === generation.current) setError("");
    } catch (e) {
      if (epoch === generation.current) {
        pending.current = current.current;
        try {
          localStorage.setItem(
            `lokabasa.pending.${repo.userId}`,
            JSON.stringify({ revision: repo.revision, data: current.current }),
          );
        } catch {}
        setError((e as Error).message);
      }
    } finally {
      if (epoch === generation.current) {
        saving.current = false;
        setSyncing(false);
      }
    }
  }
  useEffect(() => {
    const online = () => void flush();
    window.addEventListener("online", online);
    return () => window.removeEventListener("online", online);
    // flush only reads refs and stable React setters, so one listener is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function update(fn: (p: UserProgress) => UserProgress) {
    if (blocked.current || !owner || owner !== loadedOwner) return;
    const value = fn(current.current);
    current.current = value;
    setProgress(value);
    pending.current = value;
    try {
      localStorage.setItem(
        `lokabasa.pending.${owner}`,
        JSON.stringify({
          revision: repository.current?.revision || 0,
          data: value,
        }),
      );
    } catch {
      setError(
        "Penyimpanan perangkat tidak tersedia. Pastikan koneksi tetap aktif.",
      );
    }
    void flush();
  }
  function retry() {
    if (blocked.current) setReload((n) => n + 1);
    else void flush();
  }
  return (
    <Context.Provider
      value={{
        progress: owner === loadedOwner ? progress : initialProgress,
        ready: ready && (!owner || owner === loadedOwner),
        error,
        syncing,
        update,
        retry,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useProgress() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("ProgressProvider required");
  return ctx;
}
