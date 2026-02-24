
"use client";

import Navbar from "@/components/navbar";
import ExhibitionBrowser from "@/components/exibitionbrowser";
import StatistikaIzlozbi from "@/components/statistikaizlozbi";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <ExhibitionBrowser />
      {/* Razmak između lista i statistike */}
        <div className="mt-12 mb-8 border-t pt-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Statistička analiza tematskih celina
            </h2>
            
            {/* 2. Prikaz grafikona */}
            <StatistikaIzlozbi />
            
            <p className="mt-4 text-sm text-gray-500 text-center italic">
              * Grafikon prikazuje distribuciju trenutno dostupnih izložbi po umetničkim pravcima.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}