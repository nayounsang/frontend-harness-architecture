import { ESLintUtils } from "@typescript-eslint/utils";
import {
    getGlobalStateHookSet,
    getHookNameFromCall,
    globalStateHooksSchema,
    isGlobalStateHook,
} from "../utils/hook-policy.js";
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

/** @type {import('../utils/hook-policy.js').HookPolicyOptions} */
const defaultHookPolicyOptions = {
    globalStateHooks: ["useSession"],
};

export const useGlobalHooksOnlyRule = createRule({
    name: "use-global-hooks-only",
    meta: {
        type: "problem",
        docs: {
            description:
                "Allow only global-state hooks (context / configured store hooks) inside useGlobal() on module components.",
        },
        messages: {
            disallowedHook:
                "`{{name}}` is not allowed in `useGlobal`. Use global-state hooks only (e.g. context). Move other hooks to `useHooks`.",
        },
        schema: globalStateHooksSchema,
    },
    defaultOptions: [defaultHookPolicyOptions],
    create(context, [options]) {
        const moduleContext = getModuleComponentContext(context);
        if (!moduleContext) return {};

        const { moduleClass } = moduleContext;
        const globalStateHooks = getGlobalStateHookSet(options);

        /**
         * @param {import('@typescript-eslint/types').TSESTree.MethodDefinition | import('@typescript-eslint/types').TSESTree.PropertyDefinition} member
         */
        function checkUseGlobalMember(member) {
            if (!isMemberOfClass(member, moduleClass)) return;
            if (getMemberKeyName(member) !== "useGlobal") return;

            const value = member.value;
            if (!value) return;

            walkTree(value, (node) => {
                if (node.type !== "CallExpression") return;
                const name = getHookNameFromCall(node);
                if (!name || !isUsePrefixHookName(name)) return;
                if (isGlobalStateHook(name, globalStateHooks)) return;

                context.report({
                    node: node.callee,
                    messageId: "disallowedHook",
                    data: { name },
                });
            });
        }

        return {
            MethodDefinition: checkUseGlobalMember,
            PropertyDefinition: checkUseGlobalMember,
        };
    },
});
