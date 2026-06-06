import { useHooksNoGlobalHooksRule } from "./use-hooks-no-global-hooks.js";
import {
    conditionModuleTestCase,
    noopCases,
    uiModuleTestCase,
} from "../test-helpers/module-fixture.js";
import { ruleTester } from "../test-helpers/rule-tester.js";

ruleTester.run("use-hooks-no-global-hooks", useHooksNoGlobalHooksRule, {
    assertionOptions: {
        requireData: true,
    },
    valid: [
        uiModuleTestCase("  useHooks() { useState(0); useEffect(() => {}, []); return {}; }"),
        conditionModuleTestCase("  useHooks() { useState(0); return {}; }"),
        noopCases.wrongFilename("  useHooks() { useSession(); return {}; }"),
        noopCases.nonModuleClass("  useHooks() { useSession(); return {}; }"),
        noopCases.multipleModuleClasses("  useHooks() { useSession(); return {}; }"),
    ],
    invalid: [
        {
            ...uiModuleTestCase("  useHooks() { useSession(); return {}; }"),
            errors: [{ messageId: "globalHook", data: { name: "useSession" } }],
        },
        {
            ...uiModuleTestCase("  useHooks() { useContext(Ctx); return {}; }"),
            errors: [{ messageId: "globalHook", data: { name: "useContext" } }],
        },
        {
            ...conditionModuleTestCase("  useHooks() { useSession(); return {}; }"),
            errors: [{ messageId: "globalHook", data: { name: "useSession" } }],
        },
    ],
});
