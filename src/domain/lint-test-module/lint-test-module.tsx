import { useEffect, useState } from "react";
import { useSession } from "../session";
import createModuleComponent, { UIModeModule } from "../../layer/layer";

type P = Record<string, never>;

class BadGlobalModule extends UIModeModule<P, unknown, unknown, unknown> {
    useGlobal() {
        useState(0);
        return useSession();
    }
    useHooks() {
        useSession();
        useEffect(() => {}, []);
        return {};
    }
    utils() { return {}; }
    UI = () => null;
}

export default createModuleComponent(new BadGlobalModule());
