import type { ReactNode } from "react";
import CategoryTabs from "../categoryTabs";
import MenuDetail from "../menuDetail";
import MenuList from "../menuList";
import { useSession } from "../session";
import createModuleComponent, { ConditionModeModule } from "@layer-harness/layer";

type BarProps = Record<string, never>;

type BarUtils = {
    mode: "listOnly" | "withDetail";
};

class BarModule extends ConditionModeModule<
    BarProps,
    ReturnType<typeof useSession>,
    Record<string, never>,
    BarUtils,
    "listOnly" | "withDetail"
> {
    useGlobal(): ReturnType<typeof useSession> {
        return useSession();
    }

    useHooks(
        _props: BarProps,
        global: ReturnType<typeof useSession>,
    ): Record<string, never> {
        void global;
        return {};
    }

    utils(ctx: {
        props: BarProps;
        global: ReturnType<typeof useSession>;
        hooks: Record<string, never>;
    }): BarUtils {
        const hasDetail = ctx.global.state.openItemRef !== null;
        return { mode: hasDetail ? "withDetail" : "listOnly" };
    }

    condition(utils: BarUtils): "listOnly" | "withDetail" {
        if (utils.mode === "withDetail") return "withDetail";
        else return "listOnly";
    }

    ConditionUI(utils: BarUtils, condition: "listOnly" | "withDetail"): ReactNode {
        switch (condition) {
            case "withDetail":
                return (
                    <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
                        <CategoryTabs />
                        <MenuList />
                        <MenuDetail />
                    </div>
                );
            case "listOnly":
                return (
                    <div style={{ maxWidth: 720, margin: "0 auto" }}>
                        <CategoryTabs />
                        <MenuList />
                    </div>
                );
        }
    }
}

const Bar = createModuleComponent(new BarModule());
export default Bar;
