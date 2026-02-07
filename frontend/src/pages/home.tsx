"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import Card from "@/components/card";
import Modal from "@/components/modal";

type Exhibition = {
  id: number;
  naziv: string;
  lokacija: string;
  datum: string;
  slikaUrl: string;
};

export default function Home() {
  const data = useMemo<Exhibition[]>(
    () => [
      {
        id: 1,
        naziv: "Ulična fotografija",
        lokacija: "Beograd",
        datum: "10.03.2026.",
        slikaUrl: "https://picsum.photos/800/500?random=21",
      },
      {
        id: 2,
        naziv: "Portreti",
        lokacija: "Novi Sad",
        datum: "15.03.2026.",
        slikaUrl: "https://picsum.photos/800/500?random=22",
      },
      {
        id: 3,
        naziv: "Priroda",
        lokacija: "Niš",
        datum: "20.03.2026.",
        slikaUrl: "https://picsum.photos/800/500?random=23",
      },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Exhibition | null>(null);

  const openModal = (ex: Exhibition) => {
    setSelected(ex);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Izložbe fotografija</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.filter(Boolean).map((ex) => (
            <Card key={ex.id} izlozba={ex} onOpen={openModal} />
          ))}
        </div>

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
              <img
                src={selected.slikaUrl}
                alt={selected.naziv}
                className="mt-2 w-full rounded"
              />

              <button
                onClick={() => alert("Mock prijava")}
                className="mt-3 w-full rounded bg-black px-3 py-2 text-white text-sm hover:opacity-90"
              >
                Prijavi se (mock)
              </button>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
