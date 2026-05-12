import type { ReactNode } from "react";
import createModuleComponent, { ConditionModeModule } from "../../layer/layer";
import type { WhiskyItem } from "./type";
import { formatWhiskyPrice } from "./util";

export type WhiskyDetailProps = { item: WhiskyItem };

type DetailUtils = {
    stock: "available" | "soldOut";
    title: string;
    categoryLine: string;
    regionBlurb: string;
    abvLine: string;
    priceLine: string;
    nose: string;
    palate: string;
    finish: string;
    drinking?: string;
    temp?: string;
    distillery?: string;
    cask?: string;
    comment?: string;
};

function whiskyDetailSections(utils: DetailUtils): ReactNode {
    return (
        <>
            <h2 style={{ margin: "0 0 8px" }}>{utils.title}</h2>
            <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{utils.categoryLine}</p>
            <p style={{ margin: "0 0 12px", color: "#444" }}>{utils.regionBlurb}</p>
            <p style={{ margin: "0 0 8px" }}>
                <strong>ABV</strong> {utils.abvLine}
            </p>
            <p style={{ margin: "0 0 12px" }}>
                <strong>가격·서빙</strong> {utils.priceLine}
            </p>
            <p style={{ margin: "0 0 4px" }}>
                <strong>테이스팅 · 향</strong> {utils.nose}
            </p>
            <p style={{ margin: "0 0 4px" }}>
                <strong>테이스팅 · 입안</strong> {utils.palate}
            </p>
            <p style={{ margin: "0 0 12px" }}>
                <strong>테이스팅 · 피니시</strong> {utils.finish}
            </p>
            {utils.drinking ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>추천 드링킹</strong> {utils.drinking}
                </p>
            ) : null}
            {utils.temp ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>온도 감</strong> {utils.temp}
                </p>
            ) : null}
            {utils.distillery ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>증류소·표현식</strong> {utils.distillery}
                </p>
            ) : null}
            {utils.cask ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>캐스크·숙성</strong> {utils.cask}
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

class WhiskyDetailModule extends ConditionModeModule<
    WhiskyDetailProps,
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
        props: WhiskyDetailProps;
        global: Record<string, never>;
        hooks: Record<string, never>;
    }): DetailUtils {
        const { item } = ctx.props;
        return {
            stock: item.soldOut ? "soldOut" : "available",
            title: item.name,
            categoryLine: `${item.category} · ${item.regionStyle}`,
            regionBlurb: item.regionBlurb,
            abvLine: item.abv,
            priceLine: formatWhiskyPrice(item),
            nose: item.tastingNose,
            palate: item.tastingPalate,
            finish: item.tastingFinish,
            drinking: item.drinkingStyles,
            temp: item.serveTempNote,
            distillery: item.distilleryNote,
            cask: item.caskDetail,
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
                        {whiskyDetailSections(utils)}
                    </div>
                );
            case "available":
            default:
                return <div>{whiskyDetailSections(utils)}</div>;
        }
    }
}

const WhiskyDetail = createModuleComponent(new WhiskyDetailModule());
export default WhiskyDetail;
