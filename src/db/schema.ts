import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// =====================
// Korisnik
// =====================
export const korisnici = pgTable("korisnik", {
  korisnikId: serial("korisnik_id").primaryKey(),
  rola: varchar("rola", { length: 30 }).notNull(), // npr: ADMIN | USER | FOTOGRAF
  imePrezime: varchar("ime_prezime", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
}, (t) => ({
  emailUq: uniqueIndex("korisnik_email_uq").on(t.email),
}));

// =====================
// Fotograf (0..1 po korisniku)
// =====================
export const fotografi = pgTable("fotograf", {
  fotografId: serial("fotograf_id").primaryKey(),
  korisnikId: integer("korisnik_id")
    .notNull()
    .references(() => korisnici.korisnikId, { onDelete: "cascade" }),
  nazivFotografa: varchar("naziv_fotografa", { length: 100 }).notNull(),
}, (t) => ({
  korisnikUq: uniqueIndex("fotograf_korisnik_uq").on(t.korisnikId), // 0..1 fotograf po korisniku
}));

// =====================
// Izlozba
// =====================
export const izlozbe = pgTable("izlozba", {
  izlozbaId: serial("izlozba_id").primaryKey(),
  nazivIzlozbe: varchar("naziv_izlozbe", { length: 150 }).notNull(),
  opisIzlozbe: text("opis_izlozbe"),
  lokacija: varchar("lokacija", { length: 150 }).notNull(),
  datum: timestamp("datum", { withTimezone: false }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("AKTIVNA"),

});

// =====================
// Slika (Izlozba 1 -> * Slika, Fotograf 1 -> * Slika)
// =====================
export const slike = pgTable("slika", {
  slikaId: serial("slika_id").primaryKey(),
  fotografId: integer("fotograf_id")
    .notNull()
    .references(() => fotografi.fotografId, { onDelete: "restrict" }),
  izlozbaId: integer("izlozba_id")
    .notNull()
    .references(() => izlozbe.izlozbaId, { onDelete: "cascade" }),
     slikaUrl: varchar("slika_url", { length: 500 }).notNull(),
  nazivFotografa: varchar("naziv_fotografa", { length: 120 }).notNull(),
  opisSlike: text("opis_slike"),
});

// =====================
// KorisnikIzlozba (M:N veza Korisnik <-> Izlozba)
// Napomena: ovo je "Registracija"
// =====================
export const korisnikIzlozba = pgTable("korisnik_izlozba", {
  registracijaId: serial("registracija_id").primaryKey(),
  korisnikId: integer("korisnik_id")
    .notNull()
    .references(() => korisnici.korisnikId, { onDelete: "cascade" }),
  izlozbaId: integer("izlozba_id")
    .notNull()
    .references(() => izlozbe.izlozbaId, { onDelete: "cascade" }),
  datumRegistracije: timestamp("datum_registracije", { withTimezone: false })
    .notNull()
    .defaultNow(),
}, (t) => ({
  // sprečava duplu registraciju istog korisnika na istu izložbu
  korisnikIzlozbaUq: uniqueIndex("korisnik_izlozba_uq").on(t.korisnikId, t.izlozbaId),
}));

// =====================
// Karta (KorisnikIzlozba 1 -> * Karta) po dijagramu
// =====================
export const karte = pgTable("karta", {
  kartaId: serial("karta_id").primaryKey(),
  registracijaId: integer("registracija_id")
    .notNull()
    .references(() => korisnikIzlozba.registracijaId, { onDelete: "cascade" }),
  qrCodePath: varchar("qr_code_path", { length: 255 }).notNull(),
});

