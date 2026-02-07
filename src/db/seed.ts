import "dotenv/config";
import { korisnici, fotografi } from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("1233", 10);

await db.transaction(async (tx) => {
  const insertedUsers = await tx
    .insert(korisnici)
    .values([
      {
        rola: "ADMIN",
        imePrezime: "Ana Milinkovic",
        email: "ana@gmail.com",
        passwordHash: hash,
      },
      {
        rola: "USER",
        imePrezime: "Petar Petrović",
        email: "petrovic@gmail.com",
        passwordHash: hash,
      },
      {
        rola: "FOTOGRAF",
        imePrezime: "Novak Đoković",
        email: "djokovic@gmail.com",
        passwordHash: hash,
      },
    ])
    .returning({
      id: korisnici.korisnikId,
      email: korisnici.email,
      imePrezime: korisnici.imePrezime,
      rola: korisnici.rola,
    });

  const fotografUser = insertedUsers.find(u => u.rola === "FOTOGRAF");

  if (fotografUser) {
    await tx.insert(fotografi).values({
      korisnikId: fotografUser.id,
      nazivFotografa: fotografUser.imePrezime,
    });
  }
});

process.exit(0);

