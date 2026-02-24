"use client";

import Navbar from "@/components/navbar";
import ExhibitionBrowser from "@/components/exibitionbrowser";
import StatistikaIzlozbi from "@/components/statistikaizlozbi";
import dynamic from 'next/dynamic';

const MapaIzlozbe = dynamic(() => import("@/components/mapaizlozbe"), { 
  ssr: false,
  loading: () => <p className="text-center p-10">Učitavanje mape...</p>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        
        {/* 1. Glavni pretraživač i kartice izložbi */}
        <ExhibitionBrowser />

        {/* Razmak i linija razdvajanja */}
        <div className="mt-12 border-t border-gray-200 pt-10">
          
          {/* 2. Sekcija za Mapu - Sledeća izložba */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
              Sledeća izložba: Portreti
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              📅 15.03.2026. | 📍 Galerija Matice srpske, Novi Sad
            </p>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <MapaIzlozbe />
            </div>
          </section>

          {/* 3. Sekcija za Statistiku - Grafikon */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Statistička analiza tematskih celina
            </h2>
            
            <StatistikaIzlozbi />
            
            <p className="mt-4 text-sm text-gray-500 text-center italic">
              * Grafikon prikazuje distribuciju trenutno dostupnih izložbi po umetničkim pravcima.
            </p>
          </section>
          
        </div>
      </main>
    </div>
  );
}