"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

export default function DodajSlikuPage() {
  const [opis, setOpis] = useState("");
  const [url, setUrl] = useState("");
  const [izlozbaId, setIzlozbaId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDodaj = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/slike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opisSlike: opis,
          slikaUrl: url,
          izlozbaId: Number(izlozbaId),
          // Naziv fotografa će API izvući iz sesije, 
          // ali ga šaljemo praznog ako zatreba fallback
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Slika uspešno dodata u bazu!");
        router.push("/moje-slike");
        router.refresh();
      } else {
        alert(data.error || "Greška pri dodavanju slike.");
      }
    } catch (err) {
      alert("Došlo je do greške na mreži.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto p-6 mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-2 text-gray-800 text-center">
            Objavi novi rad
          </h1>
          <p className="text-gray-500 text-center mb-8 text-sm">
            Popunite detalje kako bi vaša fotografija bila vidljiva u galeriji izložbe.
          </p>
          
          <form onSubmit={handleDodaj} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Link do slike (URL)
              </label>
              <input 
                type="text" 
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all" 
                placeholder="https://images.unsplash.com/..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                ID Izložbe (Proverite u listi izložbi)
              </label>
              <input 
                type="number" 
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all" 
                placeholder="Unesite broj (npr. 1)" 
                value={izlozbaId}
                onChange={(e) => setIzlozbaId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Opis rada
              </label>
              <textarea 
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all" 
                rows={4} 
                placeholder="Kratak opis vaše fotografije..."
                value={opis}
                onChange={(e) => setOpis(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 shadow-lg shadow-gray-200"
              }`}
            >
              {loading ? "Slanje..." : "Objavi fotografiju"}
            </button>
            
            <button 
              type="button"
              onClick={() => router.back()}
              className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors"
            >
              Otkaži i vrati se nazad
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}