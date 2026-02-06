import {Izlozba,Slika} from "../shared/types";

export const mockIzlozbe: Izlozba[] = [
    {
        id:1,
        naziv: "Beograd nocu",
        opis: "Izlozba fotografija Beograda nocu",
        datumPocetka: "2023-01-01",
        datumZavrsetka: "2023-12-31",  
        lokacija: "Galerija 1",
        fotografId: 1
    },
    {
        id:2,
        naziv: "Priroda Srbije",
        opis: "Izlozba fotografija prirode Srbije",
        datumPocetka: "2023-02-01",
        datumZavrsetka: "2023-11-30",  
        lokacija: "Galerija 2",
        fotografId: 2
    },
    {
        id:3,
        naziv: "Portreti",
        opis: "Izlozba portretnih fotografija",
        datumPocetka: "2023-03-01",
        datumZavrsetka: "2023-10-31",  
        lokacija: "Galerija 3",
        fotografId: 1
    }
];
export const mockSlike: Slika[] = [
  {
    id: 1,
    izlozbaId: 1,
    url: "https://picsum.photos/500/300?11",
    opis: "Kalemegdan noću",
    autor: "Marko Marković",
  },
  {
    id: 2,
    izlozbaId: 1,
    url: "https://picsum.photos/500/300?12",
    opis: "Brankov most",
    autor: "Ana Anić",
  },
  {
    id: 3,
    izlozbaId: 2,
    url: "https://picsum.photos/500/300?21",
    opis: "Tara u magli",
    autor: "Jovan Jovanović",
  },
];
