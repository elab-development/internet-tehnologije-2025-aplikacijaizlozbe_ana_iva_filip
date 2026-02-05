CREATE TABLE "fotograf" (
	"fotograf_id" serial PRIMARY KEY NOT NULL,
	"korisnik_id" integer NOT NULL,
	"naziv_fotografa" varchar(120) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "izlozba" (
	"izlozba_id" serial PRIMARY KEY NOT NULL,
	"naziv_izlozbe" varchar(150) NOT NULL,
	"opis_izlozbe" text,
	"lokacija" varchar(150) NOT NULL,
	"datum" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "karta" (
	"karta_id" serial PRIMARY KEY NOT NULL,
	"registracija_id" integer NOT NULL,
	"qr_code_path" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "korisnik" (
	"korisnik_id" serial PRIMARY KEY NOT NULL,
	"rola" varchar(30) NOT NULL,
	"ime_prezime" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "korisnik_izlozba" (
	"registracija_id" serial PRIMARY KEY NOT NULL,
	"korisnik_id" integer NOT NULL,
	"izlozba_id" integer NOT NULL,
	"datum_registracije" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slika" (
	"slika_id" serial PRIMARY KEY NOT NULL,
	"fotograf_id" integer NOT NULL,
	"izlozba_id" integer NOT NULL,
	"naziv_fotografa" varchar(120) NOT NULL,
	"opis_slike" text
);
--> statement-breakpoint
ALTER TABLE "fotograf" ADD CONSTRAINT "fotograf_korisnik_id_korisnik_korisnik_id_fk" FOREIGN KEY ("korisnik_id") REFERENCES "public"."korisnik"("korisnik_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karta" ADD CONSTRAINT "karta_registracija_id_korisnik_izlozba_registracija_id_fk" FOREIGN KEY ("registracija_id") REFERENCES "public"."korisnik_izlozba"("registracija_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "korisnik_izlozba" ADD CONSTRAINT "korisnik_izlozba_korisnik_id_korisnik_korisnik_id_fk" FOREIGN KEY ("korisnik_id") REFERENCES "public"."korisnik"("korisnik_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "korisnik_izlozba" ADD CONSTRAINT "korisnik_izlozba_izlozba_id_izlozba_izlozba_id_fk" FOREIGN KEY ("izlozba_id") REFERENCES "public"."izlozba"("izlozba_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slika" ADD CONSTRAINT "slika_fotograf_id_fotograf_fotograf_id_fk" FOREIGN KEY ("fotograf_id") REFERENCES "public"."fotograf"("fotograf_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slika" ADD CONSTRAINT "slika_izlozba_id_izlozba_izlozba_id_fk" FOREIGN KEY ("izlozba_id") REFERENCES "public"."izlozba"("izlozba_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "fotograf_korisnik_uq" ON "fotograf" USING btree ("korisnik_id");--> statement-breakpoint
CREATE UNIQUE INDEX "korisnik_email_uq" ON "korisnik" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "korisnik_izlozba_uq" ON "korisnik_izlozba" USING btree ("korisnik_id","izlozba_id");