export type WineDecantingPolicy = "yes" | "no" | "optional";

export type WineItem = {
    id: string;
    name: string;
    wineType: string;
    varietal: string;
    region: string;
    bodyTag: string;
    acidTag: string;
    tanninTag: string;
    vintageLabel: string;
    priceGlassKrw: number | null;
    priceBottleKrw: number | null;
    currencyLabel: string;
    soldOutGlass: boolean;
    soldOutBottle: boolean;
    tastingNose: string;
    tastingPalate: string;
    tastingFinish: string;
    pairing?: string;
    serveTemp?: string;
    decanting?: WineDecantingPolicy;
    abv?: string;
};
