"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Compass,
  Home,
  Map,
  MessageCircle,
  User,
  Flame,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useProgress } from "@/lib/store";
import { streaks } from "@/lib/progress";
import { Avatar } from "./avatar";
import { Mascot } from "./illustrations";
const nav = [
  { href: "/beranda", title: "Beranda", icon: Home },
  { href: "/belajar", title: "Belajar", icon: Compass },
  { href: "/ngobrol", title: "Ngobrol", icon: MessageCircle },
  { href: "/peta", title: "Peta Nusantara", icon: Map },
  { href: "/kamus", title: "Buku Ungkapan", icon: BookOpen },
  { href: "/profil", title: "Profil", icon: User },
];
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="LokaBasa beranda">
      <span className="brand-mark">
        <MessageCircle size={23} />
        <i />
      </span>
      Loka<span>Basa</span>
      <span className="brand-dot">.</span>
    </Link>
  );
}
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname(),
    { progress, ready, error, syncing, retry } = useProgress();
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("offline", sync);
    window.addEventListener("online", sync);
    return () => {
      window.removeEventListener("offline", sync);
      window.removeEventListener("online", sync);
    };
  }, []);
  const immersive =
    pathname.startsWith("/lesson") ||
    pathname === "/onboarding" ||
    pathname === "/latihan";
  if (["/", "/masuk", "/daftar"].includes(pathname) || immersive)
    return (
      <>
        {error && (
          <div className="global-notice" role="alert">
            {error} <button onClick={retry}>Coba sinkron lagi</button>
          </div>
        )}
        {children}
      </>
    );
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <p className="nav-label">PERJALANANMU</p>
        <nav aria-label="Navigasi utama">
          {nav.map(({ href, title, icon: Icon }) => (
            <Link
              href={href}
              key={href}
              aria-label={title}
              className={pathname.startsWith(href) ? "active" : ""}
            >
              <Icon size={21} />
              <span>{title}</span>
              {pathname.startsWith(href) && <i />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-komo">
          <Mascot />
          <strong>
            Sedikit setiap hari,
            <br />
            dekat dengan negeri.
          </strong>
          <p>
            Satu ungkapan adalah awal
            <br />
            dari sebuah pertemanan.
          </p>
        </div>
        <div className="sidebar-bottom">
          <Avatar id={progress.avatarId} />
          <div>
            <strong>{progress.name}</strong>
            <small>Penjelajah Nusantara</small>
          </div>
          <Link href="/profil" aria-label="Buka profil">
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <span className="breadcrumb">
            {syncing
              ? "Menyimpan perjalanan…"
              : "Perjalanan kecil, cerita besar"}{" "}
            <span>✦</span>
          </span>
          <div className="top-stats">
            <span className="streak">
              <Flame size={20} />
              {streaks(progress.activityDates).current} <small>hari</small>
            </span>
            <span className="xp">
              <Zap size={19} />
              {progress.xp} <small>XP</small>
            </span>
            <Link className="avatar" href="/profil" aria-label="Profil">
              <Avatar id={progress.avatarId} />
            </Link>
          </div>
        </header>
        {(offline || error) && (
          <div className="global-notice" role="status">
            {error ||
              "Kamu sedang offline. Progres sesi disimpan di perangkat dan akan dicoba sinkron kembali saat online."}
            {error && <button onClick={retry}>Coba lagi</button>}
          </div>
        )}
        <main id="main-content" className="main-content">
          {ready ? (
            children
          ) : (
            <div className="skeleton" aria-label="Memuat perjalanan…" />
          )}
        </main>
        <footer className="app-footer">
          Dibuat untuk mendekatkan.{" "}
          <span>LokaBasa · Jelajah bahasa, jumpa cerita.</span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Navigasi mobile">
        {nav
          .filter((n) => n.href !== "/kamus")
          .map(({ href, title, icon: Icon }) => (
            <Link
              href={href}
              key={href}
              className={pathname.startsWith(href) ? "active" : ""}
            >
              <Icon size={21} />
              <span>{title === "Peta Nusantara" ? "Peta" : title}</span>
            </Link>
          ))}
      </nav>
    </div>
  );
}
