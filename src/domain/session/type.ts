export type Category = "cocktail" | "whisky" | "wine";

export type SelectedItemRef = {
    category: Category;
    id: string;
} | null;

export type SessionState = {
    currentCategory: Category;
    openItemRef: SelectedItemRef;
};

export type SessionAction =
    | { type: "SET_CATEGORY"; category: Category }
    | { type: "OPEN_ITEM"; ref: NonNullable<SelectedItemRef> }
    | { type: "CLOSE_ITEM" };
