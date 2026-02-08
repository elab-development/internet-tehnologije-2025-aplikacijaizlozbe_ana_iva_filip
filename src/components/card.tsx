type Izlozba = {
  id: number;
  naziv: string;
  lokacija: string;
  datum: string;
  slikaUrl: string;
};

export default function Card({
  izlozba,
  onOpen,
}: {
  izlozba: Izlozba;
  onOpen: (ex: Izlozba) => void;
}) {
  return (
    <div className="rounded border bg-white overflow-hidden">
      <img
        src={izlozba.slikaUrl}
        alt={izlozba.naziv}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold">{izlozba.naziv}</h3>
        <p className="text-sm text-gray-600">{izlozba.lokacija}</p>
        <p className="text-sm text-gray-600">{izlozba.datum}</p>

        <button
          onClick={() => onOpen(izlozba)}
          className="mt-3 w-full rounded bg-black text-white px-3 py-2 text-sm hover:opacity-90"
        >
          Detalji
        </button>
      </div>
    </div>
  );
}
