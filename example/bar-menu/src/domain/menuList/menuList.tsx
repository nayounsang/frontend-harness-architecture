import type { ReactNode } from "react";
import {
    Row as CocktailRow,
    getItems as getCocktailItems,
    type Item as CocktailItem,
} from "../cocktailDetail";
import {
    Row as WhiskyRow,
    getItems as getWhiskyItems,
    type Item as WhiskyItem,
} from "../whiskyDetail";
import {
    Row as WineRow,
    getItems as getWineItems,
    type Item as WineItem,
} from "../wineDetail";
import { useSession } from "../session";
import createModuleComponent, { ConditionModeModule } from "@layer-harness/layer";
import { MENU_LIST_HEADING } from "./util";

type MenuListProps = Record<string, never>;

type CocktailListUtils = {
    kind: "cocktail";
    title: string;
    items: CocktailItem[];
    onSelect: (id: string) => void;
};

type WhiskyListUtils = {
    kind: "whisky";
    title: string;
    items: WhiskyItem[];
    onSelect: (id: string) => void;
};

type WineListUtils = {
    kind: "wine";
    title: string;
    items: WineItem[];
    onSelect: (id: string) => void;
};

type MenuListUtils = CocktailListUtils | WhiskyListUtils | WineListUtils;

class MenuListModule extends ConditionModeModule<
    MenuListProps,
    ReturnType<typeof useSession>,
    Record<string, never>,
    MenuListUtils,
    "cocktail" | "whisky" | "wine"
> {
    useGlobal(): ReturnType<typeof useSession> {
        return useSession();
    }

    useHooks(
        _props: MenuListProps,
        global: ReturnType<typeof useSession>,
    ): Record<string, never> {
        void global;
        return {};
    }

    utils(ctx: {
        props: MenuListProps;
        global: ReturnType<typeof useSession>;
        hooks: Record<string, never>;
    }): MenuListUtils {
        const { state, openItem } = ctx.global;
        const category = state.currentCategory;
        if (category === "cocktail") {
            return {
                kind: "cocktail",
                title: MENU_LIST_HEADING,
                items: getCocktailItems(),
                onSelect: (id: string) => openItem({ category: "cocktail", id }),
            };
        }
        if (category === "whisky") {
            return {
                kind: "whisky",
                title: MENU_LIST_HEADING,
                items: getWhiskyItems(),
                onSelect: (id: string) => openItem({ category: "whisky", id }),
            };
        }
        return {
            kind: "wine",
            title: MENU_LIST_HEADING,
            items: getWineItems(),
            onSelect: (id: string) => openItem({ category: "wine", id }),
        };
    }

    condition(utils: MenuListUtils): "cocktail" | "whisky" | "wine" {
        return utils.kind;
    }

    ConditionUI(utils: MenuListUtils, condition: "cocktail" | "whisky" | "wine"): ReactNode {
        switch (condition) {
            case "cocktail":
                return (
                    <section aria-label="칵테일 메뉴 목록">
                        <h2 style={{ fontSize: 18, margin: "0 0 12px" }}>
                            {utils.title}
                        </h2>
                        {(utils as CocktailListUtils).items.map((item) => (
                            <CocktailRow
                                key={item.id}
                                item={item}
                                onSelect={() => utils.onSelect(item.id)}
                            />
                        ))}
                    </section>
                );
            case "whisky":
                return (
                    <section aria-label="위스키 메뉴 목록">
                        <h2 style={{ fontSize: 18, margin: "0 0 12px" }}>
                            {utils.title}
                        </h2>
                        {(utils as WhiskyListUtils).items.map((item) => (
                            <WhiskyRow
                                key={item.id}
                                item={item}
                                onSelect={() => utils.onSelect(item.id)}
                            />
                        ))}
                    </section>
                );
            case "wine":
                return (
                    <section aria-label="와인 메뉴 목록">
                        <h2 style={{ fontSize: 18, margin: "0 0 12px" }}>
                            {utils.title}
                        </h2>
                        {(utils as WineListUtils).items.map((item) => (
                            <WineRow
                                key={item.id}
                                item={item}
                                onSelect={() => utils.onSelect(item.id)}
                            />
                        ))}
                    </section>
                );
        }
    }
}

const MenuList = createModuleComponent(new MenuListModule());
export default MenuList;
