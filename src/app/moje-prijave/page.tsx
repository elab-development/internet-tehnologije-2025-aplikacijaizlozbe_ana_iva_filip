"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Prijava = {
  registracijaId: number;
  datumRegistracije: string;
  izlozbaId: number;
  nazivIzlozbe: string;
  lokacija: string;
  datumIzlozbe: string;
  status: string;
};

export default function MojePrijavePage() {
  const [prijave, setPrijave] = useState<Prijava[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/prijave/moje", { credentials: "include" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.error ?? "Ne mogu da učitam prijave.");
        return;
      }

      setPrijave(data?.prijave ?? []);
    })();
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Moje prijave</h1>
        <Link href="/" className="text-sm underline">
          Nazad
        </Link>
      </div>

      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

      {!err && prijave.length === 0 && (
        <p className="mt-4 text-sm text-gray-600">Nema prijava.</p>
      )}

      <ul className="mt-4 space-y-3">
        {prijave.map((p) => (
          <li key={p.registracijaId} className="rounded border bg-white p-4">
            <div className="font-medium">{p.nazivIzlozbe}</div>
            <div className="text-sm text-gray-600">
              {p.lokacija} • {p.datumIzlozbe} • {p.status}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Prijavljen: {p.datumRegistracije}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}