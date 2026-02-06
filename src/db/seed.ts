import "dotenv/config";
import { korisnici } from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("1233", 10);

await db.transaction(async (tx) => {
    await tx.insert(korisnici).values([
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
    ]);
});

process.exit(0);
