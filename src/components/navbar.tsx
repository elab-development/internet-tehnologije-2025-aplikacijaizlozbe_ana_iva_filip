"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MeUser = {
  email: string;
  rola?: string;
};

type Prijava = {
  registracijaId: number;
  datumRegistracije: string;
  izlozbaId: number;
  nazivIzlozbe: string;
  lokacija: string;
  datumIzlozbe: string;
  status: string;
};

export default function Navbar() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [prijave, setPrijave] = useState<Prijava[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      const u = data?.user ?? null;
      setUser(u);

      if (u && u.rola === "USER") {
        const r2 = await fetch("/api/prijave/moje", { credentials: "include" });
        const d2 = await r2.json().catch(() => ({}));
        setPrijave(d2?.prijave ?? []);
      } else {
        setPrijave([]);
      }
    })();
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setPrijave([]);
    setOpen(false);
  };

  return (
    <header className="w-full border-b bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Runo
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/" className="px-3 py-2 text-sm rounded hover:bg-white hover:text-black">
            Početna
          </Link>

          {!user ? (
            <>
              <Link href="/login" className="px-3 py-2 text-sm rounded hover:bg-white hover:text-black">
                Ulogujte se
              </Link>
              <Link href="/register" className="px-3 py-2 text-sm rounded hover:bg-white hover:text-black">
                Registrujte se
              </Link>
            </>
          ) : (
            <div className="relative" ref={boxRef}>
              <button
                onClick={() => setOpen((p) => !p)}
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                aria-label="Profil"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-72 rounded border bg-white text-black shadow z-50">
                  <div className="px-3 py-2 text-sm">
                    <div className="font-medium truncate">{user.email}</div>
                    <div className="text-gray-600">Rola: {user.rola ?? "-"}</div>
                  </div>

                  <div className="border-t" />

                  {/* LOGIKA ZA FOTOGRAFA */}
                  {user.rola === "FOTOGRAF" ? (
                    <>
                      <div className="px-3 py-2 text-xs text-gray-500 font-bold uppercase">
                        Upravljanje sadržajem
                      </div>
                      <Link
                        href="/moje-slike"
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 text-sm hover:bg-gray-100 text-blue-600 font-medium"
                      >
                        📸 Moje slike (Izmena / Brisanje)
                      </Link>
                      <Link
                        href="/dodaj-sliku"
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        ➕ Dodaj novu sliku
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* LOGIKA ZA OBIČNOG KORISNIKA */}
                      <div className="px-3 py-2 text-xs text-gray-500 uppercase">
                        Poslednje prijave
                      </div>
                      {prijave.slice(0, 3).map((p) => (
                        <div key={p.registracijaId} className="px-3 py-2 text-sm border-b last:border-0">
                          <div className="font-medium truncate">{p.nazivIzlozbe}</div>
                          <div className="text-xs text-gray-600 truncate">
                            {p.lokacija} • {p.datumIzlozbe}
                          </div>
                        </div>
                      ))}
                      {prijave.length === 0 && (
                        <div className="px-3 pb-2 text-sm text-gray-600">Nema prijava.</div>
                      )}

                      <Link
                        href="/moje-prijave"
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 text-sm hover:bg-gray-100 border-t"
                      >
                        Sve moje prijave
                      </Link>
                    </>
                  )}

                  <div className="border-t" />
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Odjava
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}