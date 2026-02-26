"use client";

import { useEffect, useState } from "react";
import Card from "@/components/card";
import Modal from "@/components/modal";

type Exhibition = {
  id: number;
  naziv: string;
  lokacija: string;
  datum: string;
  slikaUrl: string;
};

export default function ExhibitionBrowser() {
  const [data, setData] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [view, setView] = useState<"details" | "gallery">("details");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Exhibition | null>(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const response = await fetch("/api/izlozbe");
        const json = await response.json();
        const izlozbeIzBaze = json.izlozbe || [];

        const enriched = await Promise.all(
          izlozbeIzBaze.map(async (ex: any) => {
            try {
              const r = await fetch(`/api/external/unsplash?query=${encodeURIComponent(ex.nazivIzlozbe)}`);
              const j = await r.json();
              return {
                id: ex.id,
                naziv: ex.nazivIzlozbe,
                lokacija: ex.lokacija,
                datum: new Date(ex.datum).toLocaleDateString("sr-RS"),
                slikaUrl: j?.url || `https://picsum.photos/800/500?random=${ex.id}`,
              };
            } catch {
              return {
                id: ex.id,
                naziv: ex.nazivIzlozbe,
                lokacija: ex.lokacija,
                datum: new Date(ex.datum).toLocaleDateString("sr-RS"),
                slikaUrl: `https://picsum.photos/800/500?random=${ex.id}`,
              };
            }
          })
        );
        if (!cancelled) {
          setData(enriched);
          setLoading(false);
        }
      } catch (err) {
        console.error("Greška:", err);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const fetchGallery = async (izlozbaId: number) => {
    setLoadingGallery(true);
    try {
      const r = await fetch(`/api/izlozbe/${izlozbaId}/slike`);
      const j = await r.json();
      setGalleryImages(j.slike || []); 
    } catch (error) {
      setGalleryImages([]);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleRegister = async (izlozbaId: number) => {
    setRegistering(true);
    try {
      const res = await fetch(`/api/izlozbe/${izlozbaId}/prijave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Uspešno ste se prijavili na izložbu!");
      } else {
        alert(data.error || "Došlo je do greške pri prijavi.");
      }
    } catch (error) {
      alert("Greška na serveru.");
    } finally {
      setRegistering(false);
    }
  };

  const locations = Array.from(new Set(data.map((d) => d.lokacija)));
  const filtered = data.filter((ex) => {
    const matchName = ex.naziv.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location ? ex.lokacija === location : true;
    return matchName && matchLocation;
  });

  const openModal = async (ex: Exhibition) => {
    setSelected(ex);
    setOpen(true);
    setView("details");
    setGalleryImages([]);
    setMapUrl(null);
    try {
      const r = await fetch(`/api/external/geocode?query=${encodeURIComponent(ex.lokacija)}`);
      const j = await r.json();
      if (j?.lat && j?.lon) setMapUrl(`https://www.openstreetmap.org/?mlat=${j.lat}&mlon=${j.lon}#map=14/${j.lat}/${j.lon}`);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
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
            {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
      </aside>

      <section className="flex-1">
        {loading ? (
          <p className="text-center py-10 italic">Učitavanje iz baze...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ex) => (
              <Card key={ex.id} izlozba={ex} onOpen={openModal} />
            ))}
          </div>
        )}
      </section>

      <Modal open={open} title={selected?.naziv || "Detalji"} onClose={() => setOpen(false)}>
        {selected && (
          <div className="text-sm">
            {view === "details" ? (
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p><b>📍 Lokacija:</b> {selected.lokacija}</p>
                  <p><b>📅 Datum:</b> {selected.datum}</p>
                  {mapUrl && (
                    <a href={mapUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs mt-1 inline-block">
                      Prikaži lokaciju na mapi
                    </a>
                  )}
                </div>
                
                <button 
                  onClick={() => { setView("gallery"); fetchGallery(selected.id); }} 
                  className="w-full rounded border p-3 hover:bg-gray-50 flex items-center justify-center gap-2 font-medium"
                >
                  🖼️ Pogledaj radove sa ove izložbe
                </button>

                <button 
                  onClick={() => handleRegister(selected.id)}
                  disabled={registering}
                  className="w-full rounded bg-black p-3 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                >
                  {registering ? "Prijavljivanje..." : "Prijavi se kao učesnik"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button onClick={() => setView("details")} className="text-gray-500 hover:text-black">
                  ← Povratak na detalje
                </button>
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {loadingGallery ? (
                    <p className="col-span-2 text-center py-4 text-gray-500">Učitavanje galerije...</p>
                  ) : galleryImages.length > 0 ? (
                    galleryImages.map((img: any) => (
                      <img 
                        key={img.slikaId} 
                        src={img.slikaUrl} 
                        className="rounded-lg object-cover h-32 w-full shadow-md" 
                        alt="rad" 
                      />
                    ))
                  ) : (
                    <p className="col-span-2 text-center py-4 text-gray-400 italic">Nema dostupnih slika za ovu izložbu.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}