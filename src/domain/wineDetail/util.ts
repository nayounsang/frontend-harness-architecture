import type { WineDecantingPolicy, WineItem } from "./type";

export function wineRowSoldOut(item: WineItem): boolean {
    const hasGlass = item.priceGlassKrw != null;
    const hasBottle = item.priceBottleKrw != null;
    if (hasGlass && hasBottle) return item.soldOutGlass && item.soldOutBottle;
    if (hasGlass) return item.soldOutGlass;
    if (hasBottle) return item.soldOutBottle;
    return false;
}

export function formatWineListPrice(item: WineItem): string {
    const parts: string[] = [];
    if (item.priceGlassKrw != null) {
        parts.push(
            `글라스 ${item.currencyLabel}${item.priceGlassKrw.toLocaleString("ko-KR")}`,
        );
    }
    if (item.priceBottleKrw != null) {
        parts.push(
            `병 ${item.currencyLabel}${item.priceBottleKrw.toLocaleString("ko-KR")}`,
        );
    }
    return parts.length > 0 ? parts.join(" · ") : "가격 문의";
}

export function wineRowSubtitle(item: WineItem): string {
    return `${item.wineType} · ${item.varietal} · ${item.region}`;
}

export function formatWineDetailPrices(item: WineItem): string {
    return formatWineListPrice(item);
}

export function wineDecantingLabel(policy: WineDecantingPolicy | undefined): string {
    if (policy === "yes") return "디캔팅 권장";
    if (policy === "no") return "디캔팅 불필요";
    if (policy === "optional") return "디캔팅 선택";
    return "";
}
