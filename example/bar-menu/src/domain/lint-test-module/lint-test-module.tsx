import { useEffect, useState } from "react";
import { useSession } from "../session";
import createModuleComponent, { UIModeModule } from "@layer-harness/layer";

type P = Record<string, never>;

class BadGlobalModule extends UIModeModule<P, unknown, unknown, unknown> {
    useGlobal() {
        // eslint-disable-next-line module/use-global-hooks-only
        useState(0);
        return useSession();
    }
    useHooks() {
        // eslint-disable-next-line module/use-hooks-no-global-hooks
        useSession();
        useEffect(() => {}, []);
        return {};
    }
    utils() { return {}; }
    UI = () => null;
}

export default createModuleComponent(new BadGlobalModule());
