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

export const useHooksNoGlobalHooksRule = createRule({
    name: "use-hooks-no-global-hooks",
    meta: {
        type: "problem",
        docs: {
            description:
                "Disallow global-state hooks (context / configured store hooks) inside useHooks() on module components.",
        },
        messages: {
            globalHook:
                "`{{name}}` is not allowed in `useHooks`. Use `useGlobal` for global-state hooks (e.g. context).",
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
        function checkUseHooksMember(member) {
            if (!isMemberOfClass(member, moduleClass)) return;
            if (getMemberKeyName(member) !== "useHooks") return;

            const value = member.value;
            if (!value) return;

            walkTree(value, (node) => {
                if (node.type !== "CallExpression") return;
                const name = getHookNameFromCall(node);
                if (!name) return;
                if (!isGlobalStateHook(name, globalStateHooks)) return;

                context.report({
                    node: node.callee,
                    messageId: "globalHook",
                    data: { name },
                });
            });
        }

        return {
            MethodDefinition: checkUseHooksMember,
            PropertyDefinition: checkUseHooksMember,
        };
    },
});
