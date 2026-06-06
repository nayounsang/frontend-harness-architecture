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

function isAllowedCaseReturn(node: TSESTree.ReturnStatement): boolean {
    const { argument } = node;
    if (argument === null) return true;
    if (argument.type === "Literal" && argument.value === null) return true;
    return argument.type === "JSXElement" || argument.type === "JSXFragment";
}

function validateCaseConsequent(statements: TSESTree.Statement[]): boolean {
    if (statements.length !== 1) return false;
    const [stmt] = statements;
    return stmt.type === "ReturnStatement" && isAllowedCaseReturn(stmt);
}

function validateSwitchCases(cases: TSESTree.SwitchCase[]): boolean {
    let pendingFallThrough = false;

    for (const switchCase of cases) {
        const { consequent } = switchCase;

        if (consequent.length === 0) {
            if (switchCase.test === null) return false;
            pendingFallThrough = true;
            continue;
        }

        if (!validateCaseConsequent(consequent)) return false;
        pendingFallThrough = false;
    }

    return !pendingFallThrough;
}

function isValidConditionUIBody(
    body: TSESTree.BlockStatement | TSESTree.Expression,
): boolean {
    if (body.type !== "BlockStatement") return false;

    const { body: statements } = body;
    if (statements.length !== 1 || statements[0].type !== "SwitchStatement") {
        return false;
    }

    const switchStmt = statements[0];
    const { discriminant } = switchStmt;

    if (discriminant.type !== "Identifier" || discriminant.name !== "condition") {
        return false;
    }

    return validateSwitchCases(switchStmt.cases);
}

export const conditionUiSwitchRule = createRule({
    name: "condition-ui-switch",
    meta: {
        type: "problem",
        docs: {
            description:
                "Require ConditionUI() on ConditionModeModule to use switch (condition) where each case contains only a return (JSX or null).",
        },
        messages: {
            requireSwitch:
                "`ConditionUI` must use only `switch (condition) { case …: return <…>; default: return …; }`. Each case body may contain a single `return` only.",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const moduleContext = getConditionModeModuleContext(context);
        if (!moduleContext) return {};

        const { moduleClass } = moduleContext;

        function checkConditionUIMember(member: ClassMember) {
            if (!isMemberOfClass(member, moduleClass)) return;
            if (getMemberKeyName(member) !== "ConditionUI") return;

            const value = member.value;
            if (!value) return;

            const body =
                value.type === "FunctionExpression" ||
                value.type === "ArrowFunctionExpression"
                    ? value.body
                    : null;

            if (!body || !isValidConditionUIBody(body)) {
                context.report({
                    node: member.key,
                    messageId: "requireSwitch",
                });
            }
        }

        return {
            MethodDefinition: checkConditionUIMember,
            PropertyDefinition: checkConditionUIMember,
        };
    },
});
