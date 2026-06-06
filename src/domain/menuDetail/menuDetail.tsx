import type { ReactNode } from "react";
import { useEffect } from "react";
import CocktailDetail from "../cocktailDetail";
import WhiskyDetail from "../whiskyDetail";
import WineDetail from "../wineDetail";
import { getItems as getCocktailItems } from "../cocktailDetail";
import { getItems as getWhiskyItems } from "../whiskyDetail";
import { getItems as getWineItems } from "../wineDetail";
import { useSession } from "../session";
import createModuleComponent, { ConditionModeModule } from "../../layer/layer";
import type { Item as CocktailItem } from "../cocktailDetail";
import type { Item as WhiskyItem } from "../whiskyDetail";
import type { Item as WineItem } from "../wineDetail";

type MenuDetailProps = Record<string, never>;

type DetailHooks = {
    onBackdropPointerDown: () => void;
};

type NoneDetailUtils = {
    kind: "none";
    onClose: () => void;
    onBackdropPointerDown: () => void;
};

type CocktailDetailUtils = {
    kind: "cocktail";
    item: CocktailItem;
    onClose: () => void;
    onBackdropPointerDown: () => void;
};

type WhiskyDetailUtils = {
    kind: "whisky";
    item: WhiskyItem;
    onClose: () => void;
    onBackdropPointerDown: () => void;
};

type WineDetailUtils = {
    kind: "wine";
    item: WineItem;
    onClose: () => void;
    onBackdropPointerDown: () => void;
};

type MenuDetailUtils =
    | NoneDetailUtils
    | CocktailDetailUtils
    | WhiskyDetailUtils
    | WineDetailUtils;

class MenuDetailModule extends ConditionModeModule<
    MenuDetailProps,
    ReturnType<typeof useSession>,
    DetailHooks,
    MenuDetailUtils,
    "none" | "cocktail" | "whisky" | "wine"
> {
    useGlobal(): ReturnType<typeof useSession> {
        return useSession();
    }

    useHooks(
        _props: MenuDetailProps,
        global: ReturnType<typeof useSession>,
    ): DetailHooks {
        const { closeItem } = global;
        useEffect(() => {
            const onKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape") closeItem();
            };
            window.addEventListener("keydown", onKeyDown);
            return () => window.removeEventListener("keydown", onKeyDown);
        }, [closeItem]);
        return {
            onBackdropPointerDown: () => closeItem(),
        };
    }

    utils(ctx: {
        props: MenuDetailProps;
        global: ReturnType<typeof useSession>;
        hooks: DetailHooks;
    }): MenuDetailUtils {
        const { state, closeItem } = ctx.global;
        const ref = state.openItemRef;
        const onBackdropPointerDown = ctx.hooks.onBackdropPointerDown;
        if (ref === null) {
            return { kind: "none", onClose: closeItem, onBackdropPointerDown };
        }
        if (ref.category === "cocktail") {
            const item = getCocktailItems().find((i) => i.id === ref.id) ?? null;
            if (item === null) {
                return { kind: "none", onClose: closeItem, onBackdropPointerDown };
            }
            return {
                kind: "cocktail",
                item,
                onClose: closeItem,
                onBackdropPointerDown,
            };
        }
        if (ref.category === "whisky") {
            const item = getWhiskyItems().find((i) => i.id === ref.id) ?? null;
            if (item === null) {
                return { kind: "none", onClose: closeItem, onBackdropPointerDown };
            }
            return {
                kind: "whisky",
                item,
                onClose: closeItem,
                onBackdropPointerDown,
            };
        }
        const item = getWineItems().find((i) => i.id === ref.id) ?? null;
        if (item === null) {
            return { kind: "none", onClose: closeItem, onBackdropPointerDown };
        }
        return {
            kind: "wine",
            item,
            onClose: closeItem,
            onBackdropPointerDown,
        };
    }

    condition(utils: MenuDetailUtils): "none" | "cocktail" | "whisky" | "wine" {
        if (utils.kind === "none") return "none";
        else if (utils.kind === "cocktail") return "cocktail";
        else if (utils.kind === "whisky") return "whisky";
        else return "wine";
    }

    ConditionUI(
        utils: MenuDetailUtils,
        condition: "none" | "cocktail" | "whisky" | "wine",
    ): ReactNode {
        switch (condition) {
            case "none":
                return null;
            case "cocktail":
                return (
                    <div
                        role="presentation"
                        onPointerDown={utils.onBackdropPointerDown}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.45)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            padding: 16,
                            zIndex: 50,
                        }}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{
                                width: "100%",
                                maxWidth: 520,
                                maxHeight: "85vh",
                                overflow: "auto",
                                background: "#fff",
                                borderRadius: "16px 16px 0 0",
                                padding: 16,
                                boxShadow: "0 -8px 32px rgba(0,0,0,0.2)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginBottom: 8,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={utils.onClose}
                                    style={{
                                        border: "1px solid #ccc",
                                        background: "#fff",
                                        borderRadius: 8,
                                        padding: "6px 10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    닫기
                                </button>
                            </div>
                            <CocktailDetail item={(utils as CocktailDetailUtils).item} />
                        </div>
                    </div>
                );
            case "whisky":
                return (
                    <div
                        role="presentation"
                        onPointerDown={utils.onBackdropPointerDown}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.45)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            padding: 16,
                            zIndex: 50,
                        }}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{
                                width: "100%",
                                maxWidth: 520,
                                maxHeight: "85vh",
                                overflow: "auto",
                                background: "#fff",
                                borderRadius: "16px 16px 0 0",
                                padding: 16,
                                boxShadow: "0 -8px 32px rgba(0,0,0,0.2)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginBottom: 8,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={utils.onClose}
                                    style={{
                                        border: "1px solid #ccc",
                                        background: "#fff",
                                        borderRadius: 8,
                                        padding: "6px 10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    닫기
                                </button>
                            </div>
                            <WhiskyDetail item={(utils as WhiskyDetailUtils).item} />
                        </div>
                    </div>
                );
            case "wine":
                return (
                    <div
                        role="presentation"
                        onPointerDown={utils.onBackdropPointerDown}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.45)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            padding: 16,
                            zIndex: 50,
                        }}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{
                                width: "100%",
                                maxWidth: 520,
                                maxHeight: "85vh",
                                overflow: "auto",
                                background: "#fff",
                                borderRadius: "16px 16px 0 0",
                                padding: 16,
                                boxShadow: "0 -8px 32px rgba(0,0,0,0.2)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginBottom: 8,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={utils.onClose}
                                    style={{
                                        border: "1px solid #ccc",
                                        background: "#fff",
                                        borderRadius: 8,
                                        padding: "6px 10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    닫기
                                </button>
                            </div>
                            <WineDetail item={(utils as WineDetailUtils).item} />
                        </div>
                    </div>
                );
        }
    }
}

const MenuDetail = createModuleComponent(new MenuDetailModule());
export default MenuDetail;
