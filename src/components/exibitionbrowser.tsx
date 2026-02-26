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
  const [view, setView] = useState<"details" | "gallery">("details"); // Novo stanje za prikaz

  // Dovući slike sa Unsplash preko naše API rute
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
    setView("details"); // Resetujemo na detalje pri svakom otvaranju

    try {
      const r = await fetch(
        `/api/external/geocode?query=${encodeURIComponent(ex.lokacija)}`
      );
      const j = await r.json();

      if (j?.lat && j?.lon) {
        setMapUrl(`https://www.openstreetmap.org/?mlat=${j.lat}&mlon=${j.lon}#map=14/${j.lat}/${j.lon}`);
      }
    } catch {
      // ignore
    }
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
    setMapUrl(null);
    setView("details");
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* LEVO – FILTERI */}
      <aside className="w-full md:w-64 rounded border bg-white p-4 space-y-4 shadow-sm">
        <div>
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Pretraga</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Naziv izložbe"
            className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div>
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Lokacija</h2>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
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

      {/* MODAL SA DINAMIČKIM PRIKAZOM */}
      <Modal
        open={open}
        title={selected ? (view === "details" ? selected.naziv : `Galerija: ${selected.naziv}`) : "Detalji"}
        onClose={closeModal}
      >
        {selected && (
          <div className="text-sm">
            {view === "details" ? (
              /* --- PRIKAZ 1: DETALJI --- */
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="mb-1"><b>📍 Lokacija:</b> {selected.lokacija}</p>
                  <p><b>📅 Datum:</b> {selected.datum}</p>
                </div>
                
                {mapUrl && (
                  <a 
                    href={mapUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-block text-blue-600 underline hover:text-blue-800"
                  >
                    Prikaži lokaciju na mapi
                  </a>
                )}

                <button 
                  onClick={() => setView("gallery")}
                  className="mt-4 w-full rounded border border-gray-300 px-3 py-3 hover:bg-gray-50 flex items-center justify-center gap-2 font-medium transition-all"
                >
                  🖼️ Pogledaj radove sa ove izložbe
                </button>

                <button
                  className="w-full rounded bg-black px-3 py-3 text-white font-bold hover:bg-gray-800 transition-all"
                  onClick={() => alert("Prijave za fotografe su otvorene do popune mesta.")}
                >
                  Prijavi se kao učesnik
                </button>
              </div>
            ) : (
              /* --- PRIKAZ 2: GALERIJA --- */
              <div className="space-y-4 animate-in fade-in duration-300">
                <button 
                  onClick={() => setView("details")}
                  className="text-gray-500 hover:text-black flex items-center gap-1 font-medium"
                >
                  ← Povratak na detalje
                </button>
                
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {/* Testne slike za seminarski */}
                  <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5" className="rounded-lg object-cover h-32 w-full shadow-sm" alt="Art 1" />
                  <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f" className="rounded-lg object-cover h-32 w-full shadow-sm" alt="Art 2" />
                  <img src="https://images.unsplash.com/photo-1460661419201-fd4ce186860d" className="rounded-lg object-cover h-32 w-full shadow-sm" alt="Art 3" />
                  <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19" className="rounded-lg object-cover h-32 w-full shadow-sm" alt="Art 4" />
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-800 text-center leading-relaxed">
                    <b>Napomena za fotografe:</b> Kao autorizovani korisnik, svoje radove možete uređivati putem panela "Moje slike".
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}