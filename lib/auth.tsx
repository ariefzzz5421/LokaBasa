"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { usePathname, useRouter } from "next/navigation";
const Context = createContext<{
  user: User | null;
  loading: boolean;
  error: string;
}>({ user: null, loading: true, error: "" });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let received = false;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      received = true;
      if (active) {
        setUser(session?.user ?? null);
        setLoading(false);
        setError("");
      }
    });
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (active && !received) {
          setUser(data.session?.user ?? null);
          setError(
            error
              ? "Sesi tidak dapat dibaca. Muat ulang untuk mencoba lagi."
              : "",
          );
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("Sesi tidak dapat dimuat. Periksa koneksi lalu muat ulang.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  return (
    <Context.Provider value={{ user, loading, error }}>
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, error } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const open = ["/", "/masuk", "/daftar", "/tentang", "/kredit"].includes(path);
  useEffect(() => {
    if (!open && !loading && !user && !error)
      router.replace(
        "/masuk?next=" + encodeURIComponent(path + window.location.search),
      );
  }, [open, loading, user, error, path, router]);
  if (open) return children;
  if (error)
    return (
      <main id="main-content" className="auth-page">
        <div className="panel">
          <h1>Koneksi terputus</h1>
          <p role="alert">{error}</p>
          <button className="button" onClick={() => window.location.reload()}>
            Coba lagi
          </button>
        </div>
      </main>
    );
  if (loading || !user)
    return (
      <main id="main-content" className="auth-page">
        <div className="skeleton" aria-label="Memuat akun…" />
      </main>
    );
  return children;
}
