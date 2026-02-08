"use client";

import { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [imePrezime, setImePrezime] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!imePrezime.trim() || !email.trim() || !password.trim()) {
      setError("Popuni sva polja.");
      return;
    }
    if (!email.includes("@")) {
      setError("Email nije validan.");
      return;
    }
    if (password.length < 6) {
      setError("Lozinka mora imati bar 6 karaktera.");
      return;
    }
     try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ imePrezime, email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data?.error ?? "Registracija nije uspela.");
      return;
    }

    setSuccess("Uspešna registracija. Preusmeravam na login...");
    setTimeout(() => router.push("/login"), 700);
  } catch {
    setError("Greška na serveru.");
  }


  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-semibold">Registracija</h1>
        <p className="mt-1 text-sm text-gray-600">
          Napravite nalog.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded border bg-white p-5">
          <div className="space-y-1">
            <label className="text-sm font-medium">Ime i prezime</label>
            <Input
              value={imePrezime}
              onChange={(e) => setImePrezime(e.target.value)}
              placeholder="npr. Petar Petrović"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Lozinka</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="najmanje 6 karaktera"
              type="password"
            />
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}

          <Button type="submit" className="w-full">
            Registrujte se
          </Button>

          <p className="text-center text-sm text-gray-600">
            Već imate nalog?{" "}
            <Link href="/login" className="font-medium underline">
              Ulogujte se
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
