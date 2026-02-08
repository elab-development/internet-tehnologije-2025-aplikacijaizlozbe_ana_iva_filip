"use client";

import { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Popunite sva polja.");
      return;
    }
    if (!email.includes("@")) {
      setError("Email nije validan.");
      return;
    }

    // MOCK login
    if (email === "test@test.com" && password === "123456") {
      router.push("/");
    } else {
      setError("Pogrešan email ili lozinka.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-gray-600">
          Prijava korisnika (mock).
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4 rounded border bg-white p-5"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@test.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Lozinka</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
            />
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full">
            Ulogujte se
          </Button>

          <p className="text-center text-sm text-gray-600">
            Još nemate nalog?{" "}
            <Link href="/register" className="font-medium underline">
              Registrujte se
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
