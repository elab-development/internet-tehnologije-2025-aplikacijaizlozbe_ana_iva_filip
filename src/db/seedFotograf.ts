import "dotenv/config";
import { db } from "./index";
import { korisnici, fotografi } from "./schema";
import { eq } from "drizzle-orm";

async function seedFotograf() {
  const [u] = await db
    .select({
      id: korisnici.korisnikId,
      ime: korisnici.imePrezime,
    })
    .from(korisnici)
    .where(eq(korisnici.email, "djokovic@gmail.com"));

  if (!u) {
    console.log("FOTOGRAF user ne postoji u bazi");
    process.exit(0);
  }

  const postoji = await db
    .select()
    .from(fotografi)
    .where(eq(fotografi.korisnikId, u.id));

  if (postoji.length) {
    console.log("Fotograf već postoji");
    process.exit(0);
  }

  await db.insert(fotografi).values({
    korisnikId: u.id,
    nazivFotografa: u.ime,
  });

  console.log("Fotograf uspešno dodat");
  process.exit(0);
}

seedFotograf().catch(console.error);
