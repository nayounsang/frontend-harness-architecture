import { utilsNoHooksRule } from "./utils-no-hooks.js";
import {
    conditionModuleTestCase,
    noopCases,
    uiModuleTestCase,
} from "../test-helpers/module-fixture.js";
import { ruleTester } from "../test-helpers/rule-tester.js";

ruleTester.run("utils-no-hooks", utilsNoHooksRule, {
    assertionOptions: {
        requireData: true,
    },
    valid: [
        uiModuleTestCase("  utils() { return {}; }"),
        uiModuleTestCase("  utils() { return [1, 2].map((x) => x); }"),
        conditionModuleTestCase("  utils() { return {}; }"),
        noopCases.wrongFilename("  utils() { useState(0); return {}; }"),
        noopCases.nonModuleClass("  utils() { useState(0); return {}; }"),
        noopCases.multipleModuleClasses("  utils() { useState(0); return {}; }"),
    ],
    invalid: [
        {
            ...uiModuleTestCase("  utils() { useState(0); return {}; }"),
            errors: [{ messageId: "noHook", data: { name: "useState" } }],
        },
        {
            ...uiModuleTestCase("  utils() { useEffect(() => {}, []); return {}; }"),
            errors: [{ messageId: "noHook", data: { name: "useEffect" } }],
        },
        {
            ...conditionModuleTestCase("  utils() { useState(0); return {}; }"),
            errors: [{ messageId: "noHook", data: { name: "useState" } }],
        },
    ],
});
