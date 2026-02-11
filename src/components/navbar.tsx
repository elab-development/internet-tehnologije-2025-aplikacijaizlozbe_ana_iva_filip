import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Runo
        </Link>

        <nav className="flex gap-2">
          <Link href="/" className="px-3 py-2 text-sm rounded hover:bg-white hover:text-black">
            Početna
          </Link>
          <Link href="/login" className="px-3 py-2 text-sm rounded hover:bg-white hover:text-black">
            Ulogujte se
          </Link>
          <Link href="/register" className="px-3 py-2 text-sm rounded hover:bg-white hover:text-black">
            Registrujte se
          </Link>
        </nav>
      </div>
    </header>
  );
}
