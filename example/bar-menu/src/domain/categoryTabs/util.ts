import type { Category } from "../session";

export const CATEGORY_ORDER: Category[] = ["cocktail", "whisky", "wine"];

export const CATEGORY_LABEL: Record<Category, string> = {
    cocktail: "칵테일",
    whisky: "위스키",
    wine: "와인",
};
