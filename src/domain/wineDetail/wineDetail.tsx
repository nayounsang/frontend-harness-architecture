import type { ReactNode } from "react";
import createModuleComponent, { ConditionModeModule } from "../../layer/layer";
import type { WineItem } from "./type";
import {
    formatWineDetailPrices,
    wineDecantingLabel,
    wineRowSoldOut,
} from "./util";

export type WineDetailProps = { item: WineItem };

type DetailUtils = {
    stock: "available" | "soldOut";
    title: string;
    metaLine: string;
    vintageLine: string;
    nose: string;
    palate: string;
    finish: string;
    priceLine: string;
    glassNote: string;
    bottleNote: string;
    pairing?: string;
    temp?: string;
    decanting?: string;
    abv?: string;
};

function wineDetailSections(utils: DetailUtils): ReactNode {
    return (
        <>
            <h2 style={{ margin: "0 0 8px" }}>{utils.title}</h2>
            <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{utils.metaLine}</p>
            <p style={{ margin: "0 0 12px" }}>
                <strong>빈티지</strong> {utils.vintageLine}
            </p>
            <p style={{ margin: "0 0 4px" }}>
                <strong>향</strong> {utils.nose}
            </p>
            <p style={{ margin: "0 0 4px" }}>
                <strong>입안</strong> {utils.palate}
            </p>
            <p style={{ margin: "0 0 12px" }}>
                <strong>피니시</strong> {utils.finish}
            </p>
            <p style={{ margin: "0 0 8px" }}>
                <strong>가격</strong> {utils.priceLine}
            </p>
            <p style={{ margin: "0 0 4px", fontSize: 13 }}>{utils.glassNote}</p>
            <p style={{ margin: "0 0 12px", fontSize: 13 }}>{utils.bottleNote}</p>
            {utils.pairing ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>페어링</strong> {utils.pairing}
                </p>
            ) : null}
            {utils.temp ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>서빙 온도</strong> {utils.temp}
                </p>
            ) : null}
            {utils.decanting ? (
                <p style={{ margin: "0 0 8px" }}>
                    <strong>디캔팅</strong> {utils.decanting}
                </p>
            ) : null}
            {utils.abv ? (
                <p style={{ margin: "0 0 0" }}>
                    <strong>도수</strong> {utils.abv}
                </p>
            ) : null}
        </>
    );
}

class WineDetailModule extends ConditionModeModule<
    WineDetailProps,
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
        props: WineDetailProps;
        global: Record<string, never>;
        hooks: Record<string, never>;
    }): DetailUtils {
        const { item } = ctx.props;
        const glassNote =
            item.priceGlassKrw != null
                ? `글라스: ${item.soldOutGlass ? "주문 불가(품절)" : "주문 가능"}`
                : "글라스 단위 미제공";
        const bottleNote =
            item.priceBottleKrw != null
                ? `병: ${item.soldOutBottle ? "주문 불가(품절)" : "주문 가능"}`
                : "병 단위 미제공";
        return {
            stock: wineRowSoldOut(item) ? "soldOut" : "available",
            title: item.name,
            metaLine: `${item.wineType} · ${item.varietal} · ${item.region}`,
            vintageLine: item.vintageLabel,
            nose: item.tastingNose,
            palate: item.tastingPalate,
            finish: item.tastingFinish,
            priceLine: formatWineDetailPrices(item),
            glassNote,
            bottleNote,
            pairing: item.pairing,
            temp: item.serveTemp,
            decanting: wineDecantingLabel(item.decanting),
            abv: item.abv,
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
                            주문 불가 (노출 단위 모두 품절)
                        </div>
                        {wineDetailSections(utils)}
                    </div>
                );
            case "available":
            default:
                return <div>{wineDetailSections(utils)}</div>;
        }
    }
}

const WineDetail = createModuleComponent(new WineDetailModule());
export default WineDetail;
