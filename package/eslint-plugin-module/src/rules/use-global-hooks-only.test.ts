import { useGlobalHooksOnlyRule } from "./use-global-hooks-only.js";
import {
    conditionModuleTestCase,
    noopCases,
    uiModuleTestCase,
} from "../test-helpers/module-fixture.js";
import { ruleTester } from "../test-helpers/rule-tester.js";

ruleTester.run("use-global-hooks-only", useGlobalHooksOnlyRule, {
    assertionOptions: {
        requireData: true,
    },
    valid: [
        uiModuleTestCase("  useGlobal() { return useSession(); }"),
        uiModuleTestCase("  useGlobal() { return useContext(Ctx); }"),
        {
            ...uiModuleTestCase("  useGlobal() { return useStore(); }"),
            options: [{ globalStateHooks: ["useStore"] }],
        },
        noopCases.wrongFilename("  useGlobal() { useState(0); return useSession(); }"),
        noopCases.nonModuleClass("  useGlobal() { useState(0); return useSession(); }"),
        noopCases.multipleModuleClasses("  useGlobal() { useState(0); return useSession(); }"),
    ],
    invalid: [
        {
            ...uiModuleTestCase("  useGlobal() { useState(0); return useSession(); }"),
            errors: [{ messageId: "disallowedHook", data: { name: "useState" } }],
        },
        {
            ...uiModuleTestCase("  useGlobal() { useEffect(() => {}, []); return useSession(); }"),
            errors: [{ messageId: "disallowedHook", data: { name: "useEffect" } }],
        },
        {
            ...conditionModuleTestCase("  useGlobal() { useState(0); return useSession(); }"),
            errors: [{ messageId: "disallowedHook", data: { name: "useState" } }],
        },
        {
            ...uiModuleTestCase("  useGlobal() { useState(0); return useStore(); }"),
            options: [{ globalStateHooks: ["useStore"] }],
            errors: [{ messageId: "disallowedHook", data: { name: "useState" } }],
        },
    ],
});
