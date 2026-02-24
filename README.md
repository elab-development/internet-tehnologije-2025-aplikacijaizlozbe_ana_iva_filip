Aplikacija za izložbe fotografija

Studentski projekat iz predmeta Internet tehnologije.
Aplikacija omogućava pregled izložbi fotografija, registraciju korisnika, prijavu na izložbe i pregled lokacije na mapi.

Funkcionalnosti

-Registracija i prijava korisnika (JWT autentifikacija)
-Pregled i filtriranje izložbi po nazivu i lokaciji
-Modal sa detaljima izložbe
-Prikaz lokacije na mapi (geocode API)
-Automatsko preuzimanje fotografija sa Unsplash API-ja
-REST API rute u JSON formatu
-Dockerizovana aplikacija

Tehnologije

-Next.js (frontend + backend)
-TypeScript
-PostgreSQL
-Drizzle ORM
-Postman
-Docker & Docker Compose
-Swagger (API dokumentacija)
-Unsplash API (eksterni servis)
-OpenStreetMap Nominatim API (eksterni servis)

Pokretanje aplikacije (Docker)

1.Instaliran Docker Desktop
2.U terminalu upisati komandu docker compose up --build
3.Otvoriti u browser-u: http://localhost:3000 

Pokretanje bez Docker-a

1.Instalirati Node.js
2.Instalirati zavisnosti: npm install
3.Pokrenuti aplikaciju: npm run dev

API dokumentacija:
-Swagger dokumentacija dostupna je na: http://localhost:3000/api-docs

Eksterni API servisi

-Unsplash API – automatsko preuzimanje fotografija
-OpenStreetMap Nominatim – geokodiranje lokacija


Organizacija Git grana:

Za upravljanje izvornim kodom i timski rad korišćen je Git sistem sa jasno definisanom strukturom grana. Ovakav pristup omogućava paralelni razvoj različitih funkcionalnosti bez ugrožavanja stabilnosti glavne verzije aplikacije. 

Korišćene su sledeće grane:
-main: Predstavlja primarnu granu sa stabilnom verzijom projekta. Kôd na ovoj grani je uvek testiran i spreman za produkciju.
-develop: Glavna integraciona grana. Ovde se spajaju sve nove funkcionalnosti pre nego što pređu u main fazu.
-feature/swagger: Namenska grana korišćena za implementaciju API dokumentacije i Swagger interfejsa.
-feature/security: Grana na kojoj je razvijen sistem autentifikacije, zaštita ruta i rad sa JWT tokenima.
-feature/ci-cd: Grana korišćena za postavljanje Docker konfiguracije i GitHub Actions automatizacije (CI/CD pipeline).

Autori

Studentski tim
Predmet: Internet tehnologije
Fakultet organizacionih nauka
