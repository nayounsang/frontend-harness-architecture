import type { TSESTree } from "@typescript-eslint/utils";

/** React context API — always treated as global-state-only (not configurable off). */
export const BUILTIN_GLOBAL_STATE_HOOKS = ["useContext"] as const;

export type HookPolicyOptions = {
    globalStateHooks?: string[];
};

export function getGlobalStateHookSet(
    options: HookPolicyOptions | undefined,
): Set<string> {
    const extra = options?.globalStateHooks ?? [];
    return new Set([...BUILTIN_GLOBAL_STATE_HOOKS, ...extra]);
}

export function getHookCallName(
    callee: TSESTree.CallExpression["callee"],
): string | null {
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

export function getHookNameFromCall(
    node: TSESTree.CallExpression,
): string | null {
    return getHookCallName(node.callee);
}

export function isGlobalStateHook(
    name: string,
    globalStateHooks: Set<string>,
): boolean {
    return globalStateHooks.has(name);
}

export const globalStateHooksSchema = [
    {
        type: "object" as const,
        properties: {
            globalStateHooks: {
                type: "array" as const,
                items: { type: "string" as const },
                description:
                    "Additional hook names allowed only in useGlobal (e.g. useSession, useStore). useContext is always included.",
            },
        },
        additionalProperties: false as const,
    },
] as const;
