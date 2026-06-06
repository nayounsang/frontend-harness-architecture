import { ESLintUtils } from "@typescript-eslint/utils";
import {
    getMemberKeyName,
    getUIModeModuleContext,
    isMemberOfClass,
} from "../utils/module-context.js";

const createRule = ESLintUtils.RuleCreator(
    (name) =>
        `https://github.com/untitle/jsproject/blob/main/front-harness/docs.md#module-${name}`,
);

export const uiImplicitReturnRule = createRule({
    name: "ui-implicit-return",
    meta: {
        type: "problem",
        docs: {
            description:
                "Require UI() on UIModeModule to use arrow expression-body (implicit return) JSX.",
        },
        messages: {
            requireImplicit:
                "`UI` must use JSX implicit return. Write business logic in `utils` instead.",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const moduleContext = getUIModeModuleContext(context);
        if (!moduleContext) return {};

        const { moduleClass } = moduleContext;

        /**
         * @param {import('@typescript-eslint/types').TSESTree.MethodDefinition | import('@typescript-eslint/types').TSESTree.PropertyDefinition} member
         */
        function checkUIMember(member) {
            if (!isMemberOfClass(member, moduleClass)) return;
            if (getMemberKeyName(member) !== "UI") return;

            const value = member.value;
            if (!value) return;

            const isExpressionBodyArrow =
                value.type === "ArrowFunctionExpression" &&
                value.body.type !== "BlockStatement";

            if (!isExpressionBodyArrow) {
                context.report({
                    node: member.key,
                    messageId: "requireImplicit",
                });
            }
        }

        return {
            MethodDefinition: checkUIMember,
            PropertyDefinition: checkUIMember,
        };
    },
});
