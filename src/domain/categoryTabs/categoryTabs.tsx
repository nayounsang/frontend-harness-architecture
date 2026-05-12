import type { Category } from "../session";
import { useSession } from "../session";
import createModuleComponent, { UIModeModule } from "../../layer/layer";
import { CATEGORY_LABEL, CATEGORY_ORDER } from "./util";

type CategoryTabsProps = Record<string, never>;

type TabModel = {
    id: Category;
    label: string;
    active: boolean;
    onSelect: () => void;
};

type TabsUtils = {
    tabs: TabModel[];
};

class CategoryTabsModule extends UIModeModule<
    CategoryTabsProps,
    ReturnType<typeof useSession>,
    Record<string, never>,
    TabsUtils
> {
    useGlobal(): ReturnType<typeof useSession> {
        return useSession();
    }

    useHooks(
        _props: CategoryTabsProps,
        global: ReturnType<typeof useSession>,
    ): Record<string, never> {
        void global;
        return {};
    }

    utils(ctx: {
        props: CategoryTabsProps;
        global: ReturnType<typeof useSession>;
        hooks: Record<string, never>;
    }): TabsUtils {
        const { state, setCategory } = ctx.global;
        return {
            tabs: CATEGORY_ORDER.map((id) => ({
                id,
                label: CATEGORY_LABEL[id],
                active: state.currentCategory === id,
                onSelect: () => setCategory(id),
            })),
        };
    }

    UI(utils: TabsUtils) {
        return (
            <nav
                role="tablist"
                style={{
                    display: "flex",
                    gap: 8,
                    padding: "8px 0 16px",
                    borderBottom: "1px solid #eee",
                    marginBottom: 16,
                }}
            >
                {utils.tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={tab.active}
                        onClick={tab.onSelect}
                        style={{
                            padding: "8px 14px",
                            borderRadius: 999,
                            border: tab.active
                                ? "1px solid #111"
                                : "1px solid #ccc",
                            background: tab.active ? "#111" : "#fff",
                            color: tab.active ? "#fff" : "#111",
                            cursor: "pointer",
                            fontWeight: tab.active ? 600 : 500,
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        );
    }
}

const CategoryTabs = createModuleComponent(new CategoryTabsModule());
export default CategoryTabs;
