import "dotenv/config";
import { korisnici, fotografi, izlozbe, slike, korisnikIzlozba, karte } from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("123456", 10);

await db.transaction(async (tx) => {
  // 1) Korisnici
  const insertedUsers = await tx
  .insert(korisnici)
  .values([
    { rola: "ADMIN", imePrezime: "Ana Milinkovic", email: "anaseed@gmail.com", passwordHash: hash },
    { rola: "USER", imePrezime: "Petar Petrović", email: "petrovicseed@gmail.com", passwordHash: hash },
    { rola: "FOTOGRAF", imePrezime: "Novak Đoković", email: "djokovicseed@gmail.com", passwordHash: hash },
    { rola: "FOTOGRAF", imePrezime: "Iva Milić", email: "ivaseed@gmail.com", passwordHash: hash },
  ])
  .onConflictDoNothing({ target: korisnici.email })
  .returning({
    id: korisnici.korisnikId,
    imePrezime: korisnici.imePrezime,
    rola: korisnici.rola,
  });

  const user = insertedUsers.find((u) => u.rola === "USER");
  const fotografUsers = insertedUsers.filter((u) => u.rola === "FOTOGRAF");

  // 2) Fotografi (za oba fotografa)
  const insertedFotografi: { id: number; naziv: string }[] = [];
  for (const fu of fotografUsers) {
    const [f] = await tx
      .insert(fotografi)
      .values({
        korisnikId: fu.id,
        nazivFotografa: fu.imePrezime,
      })
      .returning({ id: fotografi.fotografId, naziv: fotografi.nazivFotografa });
    insertedFotografi.push(f);
  }

  const fotograf1 = insertedFotografi[0];
  const fotograf2 = insertedFotografi[1] ?? insertedFotografi[0];

  // 3) Izložbe
  const insertedIzlozbe = await tx
    .insert(izlozbe)
    .values([
      {
        nazivIzlozbe: "Ulična fotografija Beograd",
        opisIzlozbe: "Selekcija urbanih kadrova i života grada.",
        lokacija: "Beograd, Kalemegdan",
        datum: new Date("2026-03-10T18:00:00"),
        status: "AKTIVNA",
      },
      {
        nazivIzlozbe: "Portreti i emocije",
        opisIzlozbe: "Portreti sa fokusom na prirodno svetlo i izraz.",
        lokacija: "Novi Sad, Trg slobode",
        datum: new Date("2026-03-17T19:00:00"),
        status: "AKTIVNA",
      },
    ])
    .returning({ id: izlozbe.izlozbaId });

  const iz1 = insertedIzlozbe[0].id;
  const iz2 = insertedIzlozbe[1].id;

  // 4) Slike (ovo direktno rešava /api/izlozbe/:id/slike)
  await tx.insert(slike).values([
    {
      fotografId: fotograf1.id,
      izlozbaId: iz1,
      slikaUrl: "https://picsum.photos/seed/iteh1/900/600",
      nazivFotografa: fotograf1.naziv,
      opisSlike: "Noćni kadar sa ulice",
    },
    {
      fotografId: fotograf2.id,
      izlozbaId: iz1,
      slikaUrl: "https://picsum.photos/seed/iteh2/900/600",
      nazivFotografa: fotograf2.naziv,
      opisSlike: "Portret u prirodnom svetlu",
    },
    {
      fotografId: fotograf1.id,
      izlozbaId: iz2,
      slikaUrl: "https://picsum.photos/seed/iteh3/900/600",
      nazivFotografa: fotograf1.naziv,
      opisSlike: "Detalj sa događaja",
    },
  ]);

  // 5) Registracija korisnika na izložbu + karta (opciono, ali lepo za demo)
  if (user) {
    const [reg] = await tx
      .insert(korisnikIzlozba)
      .values({ korisnikId: user.id, izlozbaId: iz1 })
      .returning({ id: korisnikIzlozba.registracijaId });

    await tx.insert(karte).values({
      registracijaId: reg.id,
      qrCodePath: "/qr/demo-karta-1.png",
    });
  }
});

process.exit(0);