import {
    createContext,
    type Dispatch,
    type ReactNode,
    useContext,
    useMemo,
    useReducer,
} from "react";
import type {
    Category,
    SelectedItemRef,
    SessionAction,
    SessionState,
} from "./type";
import {
    createCloseItemAction,
    createOpenItemAction,
    createSetCategoryAction,
    initialSessionState,
    sessionReducer,
} from "./util";

type SessionContextValue = {
    state: SessionState;
    dispatch: Dispatch<SessionAction>;
    setCategory: (category: Category) => void;
    openItem: (ref: NonNullable<SelectedItemRef>) => void;
    closeItem: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(sessionReducer, initialSessionState);

    const value = useMemo<SessionContextValue>(
        () => ({
            state,
            dispatch,
            setCategory: (category) => dispatch(createSetCategoryAction(category)),
            openItem: (ref) => dispatch(createOpenItemAction(ref)),
            closeItem: () => dispatch(createCloseItemAction()),
        }),
        [state],
    );

    return (
        <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
    );
}

export function useSession(): SessionContextValue {
    const ctx = useContext(SessionContext);
    if (!ctx) {
        throw new Error("useSession must be used within SessionProvider");
    }
    return ctx;
}
