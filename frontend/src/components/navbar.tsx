import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Izložbe
        </Link>

        <nav className="flex gap-2">
          <Link href="/" className="px-3 py-2 text-sm rounded hover:bg-gray-100">
            Početna
          </Link>
          <Link href="/login" className="px-3 py-2 text-sm rounded hover:bg-gray-100">
            Uloguj se
          </Link>
          <Link href="/register" className="px-3 py-2 text-sm rounded hover:bg-gray-100">
            Registruj se
          </Link>
        </nav>
      </div>
    </header>
  );
}
