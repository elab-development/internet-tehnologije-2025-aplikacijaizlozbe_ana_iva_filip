import { NextResponse } from "next/server";

export async function GET() {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Izložba Slika API",
      version: "1.0.0",
      description: "API specifikacija za aplikaciju online izložbe slika",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Lokalni razvojni server",
      },
    ],
    paths: {
      "/api/auth/login": {
        post: {
          summary: "Login korisnika",
          description: "Prijavljivanje korisnika na sistem sa emailom i lozinkom.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "korisnik@example.com" },
                    password: { type: "string", example: "lozinka123" }
                  },
                  required: ["email", "password"]
                }
              }
            }
          },
          responses: {
            "200": { description: "Uspešna prijava" },
            "401": { description: "Pogrešan email ili lozinka" },
          },
        },
      },
      "/api/auth/register": {
        post: {
          summary: "Registracija korisnika",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    imePrezime: { type: "string", example: "Iva Ivić" }, // Usklađeno sa tvojim kodom
                    email: { type: "string", example: "iva@example.com" },
                    password: { type: "string", example: "sigurnaLozinka" }
                  },
                  required: ["imePrezime", "email", "password"] // Dodato da Swagger zna šta je obavezno
                }
              }
            }
          },
          responses: {
            "201": { description: "Korisnik uspešno kreiran" },
            "400": { description: "Nedostaju podaci ili email postoji" },
          },
        },
      },
      "/api/izlozbe": {
        get: {
          summary: "Prikaz svih izložbi",
          description: "Javna ruta koja vraća listu svih izložbi poređanih po datumu (od najnovijih).",
          responses: {
            "200": { 
              description: "Uspešno preuzeta lista izložbi",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      izlozbe: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "number" },
                            nazivIzlozbe: { type: "string" },
                            lokacija: { type: "string" },
                            datum: { type: "string", format: "date-time" },
                            status: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
        },
      },
    }
  }
  
  return NextResponse.json(spec);
}

