import type { CocktailItem } from "./type";

export function formatCocktailPrice(item: CocktailItem): string {
    return `${item.currencyLabel} ${item.priceKrw.toLocaleString("ko-KR")} / ${item.servingUnit}`;
}

export function cocktailRowSubtitle(item: CocktailItem): string {
    return `${item.baseSpirit} · ${item.style} · ${item.servingGlass}`;
}
