import { ESLintUtils } from "@typescript-eslint/utils";
import {
    getConditionModeModuleContext,
    getMemberKeyName,
    isMemberOfClass,
} from "../utils/module-context.js";

const createRule = ESLintUtils.RuleCreator(
    (name) =>
        `https://github.com/untitle/jsproject/blob/main/front-harness/docs.md#module-${name}`,
);

/**
 * @param {import('@typescript-eslint/types').TSESTree.Statement | import('@typescript-eslint/types').TSESTree.BlockStatement} node
 * @returns {import('@typescript-eslint/types').TSESTree.ReturnStatement | null}
 */
function getReturnFromConsequent(node) {
    if (node.type === "ReturnStatement") return node;
    if (node.type === "BlockStatement" && node.body.length === 1) {
        const [stmt] = node.body;
        return stmt?.type === "ReturnStatement" ? stmt : null;
    }
    return null;
}

/**
 * @param {import('@typescript-eslint/types').TSESTree.ReturnStatement | null} node
 * @returns {boolean}
 */
function isStringLiteralReturn(node) {
    if (!node || node.type !== "ReturnStatement") return false;
    const { argument } = node;
    return (
        argument?.type === "Literal" &&
        typeof argument.value === "string" &&
        !argument.regex
    );
}

/**
 * @param {import('@typescript-eslint/types').TSESTree.IfStatement} ifStmt
 * @returns {boolean}
 */
function validateIfElseChain(ifStmt) {
    const branchReturn = getReturnFromConsequent(ifStmt.consequent);
    if (!isStringLiteralReturn(branchReturn)) return false;

    const { alternate } = ifStmt;
    if (!alternate) return true;

    if (alternate.type === "IfStatement") {
        return validateIfElseChain(alternate);
    }

    return isStringLiteralReturn(getReturnFromConsequent(alternate));
}

/**
 * @param {import('@typescript-eslint/types').TSESTree.BlockStatement | import('@typescript-eslint/types').TSESTree.Expression} body
 * @returns {boolean}
 */
function isValidConditionBody(body) {
    if (body.type !== "BlockStatement") return false;

    const { body: statements } = body;
    if (statements.length !== 1 || statements[0].type !== "IfStatement") {
        return false;
    }

    return validateIfElseChain(statements[0]);
}

export const conditionIfReturnRule = createRule({
    name: "condition-if-return",
    meta: {
        type: "problem",
        docs: {
            description:
                "Require condition() on ConditionModeModule to use only if / else if / else with string literal returns.",
        },
        messages: {
            requireIfChain:
                "`condition` must use only `if` / `else if` / `else` branches, each returning a string literal.",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const moduleContext = getConditionModeModuleContext(context);
        if (!moduleContext) return {};

        const { moduleClass } = moduleContext;

        /**
         * @param {import('@typescript-eslint/types').TSESTree.MethodDefinition | import('@typescript-eslint/types').TSESTree.PropertyDefinition} member
         */
        function checkConditionMember(member) {
            if (!isMemberOfClass(member, moduleClass)) return;
            if (getMemberKeyName(member) !== "condition") return;

            const value = member.value;
            if (!value) return;

            const body =
                value.type === "FunctionExpression" ||
                value.type === "ArrowFunctionExpression"
                    ? value.body
                    : null;

            if (!body || !isValidConditionBody(body)) {
                context.report({
                    node: member.key,
                    messageId: "requireIfChain",
                });
            }
        }

        return {
            MethodDefinition: checkConditionMember,
            PropertyDefinition: checkConditionMember,
        };
    },
});
