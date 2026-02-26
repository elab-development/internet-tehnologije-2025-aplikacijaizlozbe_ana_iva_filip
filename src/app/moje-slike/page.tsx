"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";

type Slika = {
  slikaId: number;
  slikaUrl: string;
  opisSlike: string;
  fotografId: number;
};

export default function MojeSlikePage() {
  const [mojeSlike, setMojeSlike] = useState<Slika[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [noviOpis, setNoviOpis] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 1. Učitavanje slika
  useEffect(() => {
    async function fetchSlike() {
      try {
        // Pretpostavka: imaš rutu koja vraća slike ulogovanog fotografa
        const res = await fetch("/api/slike/moje"); 
        const data = await res.json();
        setMojeSlike(data.slike || []);
      } catch (err) {
        setError("Greška pri učitavanju slika.");
      } finally {
        setLoading(false);
      }
    }
    fetchSlike();
  }, []);

  // 2. Brisanje slike (koristi tvoj DELETE /api/slike/:id)
  const handleObrisi = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovu fotografiju?")) return;

    try {
      const res = await fetch(`/api/slike/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Greška pri brisanju");
      }

      setMojeSlike(mojeSlike.filter((s) => s.slikaId !== id));
      alert("Slika uspešno obrisana.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 3. Izmena slike (koristi tvoj PUT /api/slike/:id)
  const handleSacuvajIzmenu = async (id: number) => {
    try {
      const res = await fetch(`/api/slike/${id}`, {
        method: "PUT", // Tvoj API zahteva PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opisSlike: noviOpis }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Greška pri izmeni");
      }

      setMojeSlike(
        mojeSlike.map((s) =>
          s.slikaId === id ? { ...s, opisSlike: noviOpis } : s
        )
      );
      setEditingId(null);
      alert("Opis uspešno ažuriran.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-10 text-center">Učitavanje...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Moje Fotografije</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            Panel za Fotografe
          </span>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {mojeSlike.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed">
            <p className="text-gray-500">Niste još uvek dodali nijednu fotografiju.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {mojeSlike.map((s) => (
              <div key={s.slikaId} className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-5 shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={s.slikaUrl} 
                  className="w-full sm:w-40 h-40 object-cover rounded-lg" 
                  alt="Vaš rad" 
                />
                
                <div className="flex-1 flex flex-col justify-center">
                  {editingId === s.slikaId ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400">Izmena opisa</label>
                      <textarea 
                        className="w-full border border-blue-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={noviOpis}
                        onChange={(e) => setNoviOpis(e.target.value)}
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-400">Opis fotografije</label>
                      <p className="text-gray-700 mt-1">{s.opisSlike}</p>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 justify-center">
                  {editingId === s.slikaId ? (
                    <>
                      <button 
                        onClick={() => handleSacuvajIzmenu(s.slikaId)} 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Sačuvaj
                      </button>
                      <button 
                        onClick={() => setEditingId(null)} 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Odustani
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setEditingId(s.slikaId); setNoviOpis(s.opisSlike); }} 
                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Izmeni opis
                      </button>
                      <button 
                        onClick={() => handleObrisi(s.slikaId)} 
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Obriši rad
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}