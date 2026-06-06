import type {
    Category,
    SelectedItemRef,
    SessionAction,
    SessionState,
} from "./type";

export const initialSessionState: SessionState = {
    currentCategory: "cocktail",
    openItemRef: null,
};

export function sessionReducer(
    state: SessionState,
    action: SessionAction,
): SessionState {
    switch (action.type) {
        case "SET_CATEGORY":
            return { ...state, currentCategory: action.category };
        case "OPEN_ITEM":
            return { ...state, openItemRef: action.ref };
        case "CLOSE_ITEM":
            return { ...state, openItemRef: null };
        default:
            return state;
    }
}

export function createSetCategoryAction(category: Category): SessionAction {
    return { type: "SET_CATEGORY", category };
}

export function createOpenItemAction(
    ref: NonNullable<SelectedItemRef>,
): SessionAction {
    return { type: "OPEN_ITEM", ref };
}

export function createCloseItemAction(): SessionAction {
    return { type: "CLOSE_ITEM" };
}
