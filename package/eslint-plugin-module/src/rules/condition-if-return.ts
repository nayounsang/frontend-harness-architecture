import { ESLintUtils } from "@typescript-eslint/utils";
import type { TSESTree } from "@typescript-eslint/utils";
import {
    getConditionModeModuleContext,
    getMemberKeyName,
    isMemberOfClass,
} from "../utils/module-context.js";

const createRule = ESLintUtils.RuleCreator(
    (name) =>
        `https://github.com/untitle/jsproject/blob/main/front-harness/docs.md#module-${name}`,
);

type ClassMember = TSESTree.MethodDefinition | TSESTree.PropertyDefinition;

function getReturnFromConsequent(
    node: TSESTree.Statement | TSESTree.BlockStatement,
): TSESTree.ReturnStatement | null {
    if (node.type === "ReturnStatement") return node;
    if (node.type === "BlockStatement" && node.body.length === 1) {
        const [stmt] = node.body;
        return stmt?.type === "ReturnStatement" ? stmt : null;
    }
    return null;
}

function isStringLiteralReturn(
    node: TSESTree.ReturnStatement | null,
): boolean {
    if (!node || node.type !== "ReturnStatement") return false;
    const { argument } = node;
    return argument?.type === "Literal" && typeof argument.value === "string";
}

function validateIfElseChain(ifStmt: TSESTree.IfStatement): boolean {
    const branchReturn = getReturnFromConsequent(ifStmt.consequent);
    if (!isStringLiteralReturn(branchReturn)) return false;

    const { alternate } = ifStmt;
    if (!alternate) return true;

    if (alternate.type === "IfStatement") {
        return validateIfElseChain(alternate);
    }

    return isStringLiteralReturn(getReturnFromConsequent(alternate));
}

function isValidConditionBody(
    body: TSESTree.BlockStatement | TSESTree.Expression,
): boolean {
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

        function checkConditionMember(member: ClassMember) {
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
