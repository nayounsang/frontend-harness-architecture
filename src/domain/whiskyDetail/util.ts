import type { WhiskyItem } from "./type";

export function formatWhiskyPrice(item: WhiskyItem): string {
    return `${item.currencyLabel} ${item.priceKrw.toLocaleString("ko-KR")} / ${item.servingUnit}`;
}

export function whiskyRowSubtitle(item: WhiskyItem): string {
    return `${item.category} · ${item.regionStyle} · ${item.abv}`;
}
