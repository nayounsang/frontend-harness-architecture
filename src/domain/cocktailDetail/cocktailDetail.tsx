import type { ReactNode } from "react";
import createModuleComponent, { ConditionModeModule } from "../../layer/layer";
import type { CocktailItem } from "./type";
import { formatCocktailPrice } from "./util";

export type CocktailDetailProps = { item: CocktailItem };

type DetailUtils = {
    stock: "available" | "soldOut";
    title: string;
    summary: string;
    baseAndMixers: string;
    glassAndTemp: string;
    priceLine: string;
    ingredients?: string;
    abv?: string;
    pairing?: string;
    comment?: string;
};

function cocktailDetailSections(utils: DetailUtils): ReactNode {
    return (
        <>
            <h2 style={{ margin: "0 0 8px" }}>{utils.title}</h2>
            <p style={{ margin: "0 0 12px", color: "#444" }}>{utils.summary}</p>
            <p style={{ margin: "0 0 8px" }}>
                <strong>베이스·부재료</strong> {utils.baseAndMixers}
            </p>
            <p style={{ margin: "0 0 8px" }}>
                <strong>글라스·온도</strong> {utils.glassAndTemp}
            </p>
            <p style={{ margin: "0 0 8px" }}>
                <strong>가격·단위</strong> {utils.priceLine}
            </p>
            {utils.ingredients ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>재료</strong> {utils.ingredients}
                </p>
            ) : null}
            {utils.abv ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>도수</strong> {utils.abv}
                </p>
            ) : null}
            {utils.pairing ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>페어링</strong> {utils.pairing}
                </p>
            ) : null}
            {utils.comment ? (
                <p style={{ margin: "0 0 0", fontSize: 13, color: "#666" }}>
                    {utils.comment}
                </p>
            ) : null}
        </>
    );
}

class CocktailDetailModule extends ConditionModeModule<
    CocktailDetailProps,
    Record<string, never>,
    Record<string, never>,
    DetailUtils,
    "available" | "soldOut"
> {
    useGlobal(): Record<string, never> {
        return {};
    }

    useHooks(): Record<string, never> {
        return {};
    }

    utils(ctx: {
        props: CocktailDetailProps;
        global: Record<string, never>;
        hooks: Record<string, never>;
    }): DetailUtils {
        const { item } = ctx.props;
        return {
            stock: item.soldOut ? "soldOut" : "available",
            title: item.name,
            summary: item.summary,
            baseAndMixers: `${item.baseSpirit} · ${item.mixersNote}`,
            glassAndTemp: `${item.servingGlass} · ${item.temperatureNote}`,
            priceLine: formatCocktailPrice(item),
            ingredients: item.ingredientList?.join(", "),
            abv: item.abvPercent,
            pairing: item.pairingTags?.join(", "),
            comment: item.storeComment,
        };
    }

    condition(utils: DetailUtils): "available" | "soldOut" {
        if (utils.stock === "soldOut") return "soldOut";
        else return "available";
    }

    ConditionUI(utils: DetailUtils, condition: "available" | "soldOut"): ReactNode {
        switch (condition) {
            case "soldOut":
                return (
                    <div>
                        <div
                            style={{
                                padding: "10px 12px",
                                background: "#ffebee",
                                color: "#b00020",
                                fontWeight: 600,
                                borderRadius: 8,
                                marginBottom: 12,
                            }}
                        >
                            주문 불가 (품절)
                        </div>
                        {cocktailDetailSections(utils)}
                    </div>
                );
            case "available":
            default:
                return <div>{cocktailDetailSections(utils)}</div>;
        }
    }
}

const CocktailDetail = createModuleComponent(new CocktailDetailModule());
export default CocktailDetail;
