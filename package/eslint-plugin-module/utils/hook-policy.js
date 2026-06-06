/** React context API — always treated as global-state-only (not configurable off). */
export const BUILTIN_GLOBAL_STATE_HOOKS = ["useContext"];

/**
 * @typedef {{ globalStateHooks?: string[] }} HookPolicyOptions
 */

/**
 * @param {HookPolicyOptions | undefined} options
 * @returns {Set<string>}
 */
export function getGlobalStateHookSet(options) {
    const extra = options?.globalStateHooks ?? [];
    return new Set([...BUILTIN_GLOBAL_STATE_HOOKS, ...extra]);
}

/**
 * @param {import('@typescript-eslint/types').TSESTree.CallExpression['callee']} callee
 * @returns {string | null}
 */
export function getHookCallName(callee) {
    if (callee.type === "Identifier") return callee.name;
    if (
        callee.type === "MemberExpression" &&
        !callee.computed &&
        callee.property.type === "Identifier"
    ) {
        return callee.property.name;
    }
    return null;
}

/**
 * @param {import('@typescript-eslint/types').TSESTree.CallExpression} node
 * @returns {string | null}
 */
export function getHookNameFromCall(node) {
    if (node.type !== "CallExpression") return null;
    return getHookCallName(node.callee);
}

/**
 * @param {string} name
 * @param {Set<string>} globalStateHooks
 * @returns {boolean}
 */
export function isGlobalStateHook(name, globalStateHooks) {
    return globalStateHooks.has(name);
}

/**
 * Shared ESLint schema for global-state hook configuration.
 *
 * @type {import('eslint').Rule.RuleMetaData['schema']}
 */
export const globalStateHooksSchema = [
    {
        type: "object",
        properties: {
            globalStateHooks: {
                type: "array",
                items: { type: "string" },
                description:
                    "Additional hook names allowed only in useGlobal (e.g. useSession, useStore). useContext is always included.",
            },
        },
        additionalProperties: false,
    },
];
