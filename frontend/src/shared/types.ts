export type Role= "USER" | "FOTOGRAF" | "ADMIN";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
 
}

export interface Izlozba {
    id: number;
    naziv: string;
    opis: string;
    datumPocetka: string;
    datumZavrsetka: string;
    lokacija: string;
    fotografId: number;
}

export interface Slika {
    id:number;
    izlozbaId: number;
    url: string;
    opis: string;
    autor: string;
    
}