import type { ReactNode } from "react";
import createModuleComponent, { ConditionModeModule } from "../../layer/layer";
import type { WhiskyItem } from "./type";
import { formatWhiskyPrice, whiskyRowSubtitle } from "./util";

export type WhiskyRowProps = { item: WhiskyItem; onSelect: () => void };

type RowUtils = {
    name: string;
    subtitle: string;
    priceLabel: string;
    aging: string;
    onSelect: () => void;
    stock: "available" | "soldOut";
};

class WhiskyRowModule extends ConditionModeModule<
    WhiskyRowProps,
    Record<string, never>,
    Record<string, never>,
    RowUtils,
    "available" | "soldOut"
> {
    useGlobal(): Record<string, never> {
        return {};
    }

    useHooks(): Record<string, never> {
        return {};
    }

    utils(ctx: {
        props: WhiskyRowProps;
        global: Record<string, never>;
        hooks: Record<string, never>;
    }): RowUtils {
        const { item, onSelect } = ctx.props;
        return {
            name: item.name,
            subtitle: whiskyRowSubtitle(item),
            priceLabel: formatWhiskyPrice(item),
            aging: item.agingCask,
            onSelect,
            stock: item.soldOut ? "soldOut" : "available",
        };
    }

    condition(utils: RowUtils): "available" | "soldOut" {
        if (utils.stock === "soldOut") return "soldOut";
        else return "available";
    }

    ConditionUI(utils: RowUtils, condition: "available" | "soldOut"): ReactNode {
        switch (condition) {
            case "soldOut":
                return (
                    <button
                        type="button"
                        onClick={utils.onSelect}
                        style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 14px",
                            marginBottom: 8,
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            background: "#fafafa",
                            cursor: "pointer",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 12,
                            }}
                        >
                            <strong>{utils.name}</strong>
                            <span style={{ color: "#b00020" }}>품절</span>
                        </div>
                        <div style={{ fontSize: 13, color: "#555" }}>
                            {utils.subtitle}
                        </div>
                        <div style={{ fontSize: 12, color: "#666" }}>
                            {utils.aging}
                        </div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>
                            {utils.priceLabel}
                        </div>
                    </button>
                );
            case "available":
            default:
                return (
                    <button
                        type="button"
                        onClick={utils.onSelect}
                        style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 14px",
                            marginBottom: 8,
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            background: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ fontWeight: 600 }}>{utils.name}</div>
                        <div style={{ fontSize: 13, color: "#555" }}>
                            {utils.subtitle}
                        </div>
                        <div style={{ fontSize: 12, color: "#666" }}>
                            {utils.aging}
                        </div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>
                            {utils.priceLabel}
                        </div>
                    </button>
                );
        }
    }
}

export const WhiskyRow = createModuleComponent(new WhiskyRowModule());
