import { conditionIfReturnRule } from "./rules/condition-if-return.js";
import { conditionUiSwitchRule } from "./rules/condition-ui-switch.js";
import { uiImplicitReturnRule } from "./rules/ui-implicit-return.js";
import { useGlobalHooksOnlyRule } from "./rules/use-global-hooks-only.js";
import { useHooksNoGlobalHooksRule } from "./rules/use-hooks-no-global-hooks.js";
import { utilsNoHooksRule } from "./rules/utils-no-hooks.js";

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
    meta: {
        name: "@layer-harness/eslint-plugin-module",
        version: "0.0.0",
    },
    rules: {
        "utils-no-hooks": utilsNoHooksRule,
        "ui-implicit-return": uiImplicitReturnRule,
        "condition-if-return": conditionIfReturnRule,
        "condition-ui-switch": conditionUiSwitchRule,
        "use-global-hooks-only": useGlobalHooksOnlyRule,
        "use-hooks-no-global-hooks": useHooksNoGlobalHooksRule,
    },
};

export default plugin;
