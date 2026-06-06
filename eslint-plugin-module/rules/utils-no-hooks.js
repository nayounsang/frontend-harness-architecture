import { ESLintUtils } from "@typescript-eslint/utils";
import {
    getMemberKeyName,
    getModuleComponentContext,
    isMemberOfClass,
    isUsePrefixHookName,
    walkTree,
} from "../utils/module-context.js";

const createRule = ESLintUtils.RuleCreator(
    (name) =>
        `https://github.com/untitle/jsproject/blob/main/front-harness/docs.md#module-${name}`,
);

export const utilsNoHooksRule = createRule({
    name: "utils-no-hooks",
    meta: {
        type: "problem",
        docs: {
            description:
                "Disallow use* hook calls inside utils() on module components (UIModeModule / ConditionModeModule).",
        },
        messages: {
            noHook:
                "`{{name}}` is not allowed in `utils`. Use `useHooks` instead.",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const moduleContext = getModuleComponentContext(context);
        if (!moduleContext) return {};

        const { moduleClass } = moduleContext;

        /**
         * @param {import('@typescript-eslint/types').TSESTree.MethodDefinition | import('@typescript-eslint/types').TSESTree.PropertyDefinition} member
         */
        function checkUtilsMember(member) {
            if (!isMemberOfClass(member, moduleClass)) return;
            if (getMemberKeyName(member) !== "utils") return;

            const value = member.value;
            if (!value) return;

            walkTree(value, (node) => {
                if (node.type !== "CallExpression") return;
                const { callee } = node;
                if (callee.type !== "Identifier") return;
                if (!isUsePrefixHookName(callee.name)) return;

                context.report({
                    node: callee,
                    messageId: "noHook",
                    data: { name: callee.name },
                });
            });
        }

        return {
            MethodDefinition: checkUtilsMember,
            PropertyDefinition: checkUtilsMember,
        };
    },
});
