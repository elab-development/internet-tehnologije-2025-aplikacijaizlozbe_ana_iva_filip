
"use client";

import Navbar from "@/components/navbar";
import ExhibitionBrowser from "@/components/exibitionbrowser";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <ExhibitionBrowser />
      </main>
    </div>
  );
}