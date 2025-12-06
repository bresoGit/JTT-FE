// src/types/natjecanja.ts
export interface Country {
  code: string; // npr. "HR"
  name: string; // npr. "Croatia"
  flag?: string | null; // opcionalno, ako API vraća emoji ili URL
}

export interface League {
  id: number;
  name: string;
  logo?: string | null;
  type?: string | null;
  countryCode?: string | null;
}
