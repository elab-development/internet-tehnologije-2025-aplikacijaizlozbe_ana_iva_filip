"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "./card";
import Modal from "./modal";

type Exhibition = {
  id: number;
  naziv: string;
  lokacija: string;
  datum: string;
  slikaUrl: string;
};

export default function ExhibitionBrowser() {
  const initial = useMemo<Exhibition[]>(
    () => [
      {
        id: 1,
        naziv: "Ulična fotografija",
        lokacija: "Beograd",
        datum: "10.02.2026.",
        slikaUrl: "",
      },
      {
        id: 2,
        naziv: "Portreti",
        lokacija: "Novi Sad",
        datum: "15.03.2026.",
        slikaUrl: "",
      },
      {
        id: 3,
        naziv: "Priroda",
        lokacija: "Niš",
        datum: "20.03.2026.",
        slikaUrl: "",
      },
    ],
    []
  );

  const [data, setData] = useState<Exhibition[]>(initial);
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  // dovuci slike sa Unsplash preko nase API rute
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const enriched = await Promise.all(
        initial.map(async (ex) => {
          try {
            const r = await fetch(
              `/api/external/unsplash?query=${encodeURIComponent(ex.naziv)}`
            );
            const j = await r.json();
            
            return {
              ...ex,
              slikaUrl: j?.url || "https://picsum.photos/800/500?random=99",
            };
          } catch {
            return {
              ...ex,
              slikaUrl: "https://picsum.photos/800/500?random=99",
            };
          }
        })
      );

      if (!cancelled) setData(enriched);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [initial]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Exhibition | null>(null);

  const locations = useMemo(
    () => Array.from(new Set(data.map((d) => d.lokacija))),
    [data]
  );

  const filtered = data.filter((ex) => {
    const matchName = ex.naziv.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location ? ex.lokacija === location : true;
    return matchName && matchLocation;
  });

  const openModal = async (ex: Exhibition) => {
  setSelected(ex);
  setOpen(true);
  setMapUrl(null);

  try {
    const r = await fetch(
      `/api/external/geocode?query=${encodeURIComponent(ex.lokacija)}`
    );
    const j = await r.json();

    if (j?.lat && j?.lon) {
      setMapUrl(`https://www.google.com/maps?q=${j.lat},${j.lon}`);
      // alternativa bez Google: `https://www.openstreetmap.org/?mlat=${j.lat}&mlon=${j.lon}#map=14/${j.lat}/${j.lon}`
    }
  } catch {
    // ignore
  }
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
    setMapUrl(null);
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* LEVO – FILTERI */}
      <aside className="w-full md:w-64 rounded border bg-white p-4 space-y-4">
        <div>
          <h2 className="mb-1 text-sm font-semibold">Pretraga</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Naziv izložbe"
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <h2 className="mb-1 text-sm font-semibold">Lokacija</h2>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="">Sve lokacije</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </aside>

      {/* DESNO – KARTICE */}
      <section className="flex-1">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <Card key={ex.id} izlozba={ex} onOpen={openModal} />
          ))}
        </div>
      </section>

      <Modal
        open={open}
        title={selected ? selected.naziv : "Detalji"}
        onClose={closeModal}
      >
        {selected && (
          <div className="space-y-2 text-sm">
            <p>
              <b>Lokacija:</b> {selected.lokacija}
            </p>
            <p>
              <b>Datum:</b> {selected.datum}
            </p>
            {mapUrl && (
               <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="block mt-2 underline"
                >
               Prikaži na mapi
               </a>
            )}
            <button
              className="mt-3 w-full rounded bg-black px-3 py-2 text-white"
              onClick={() => alert("Prijava krece sledeceg meseca")}
            >
              Prijavi se
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
