import type { FC, ReactNode } from "react";

type CreateUtilsCtx<P, G, H> = {
    props: P;
    global: G;
    hooks: H;
};

abstract class BaseModule<P, G, H, U> {
    abstract useGlobal(): G;

    abstract useHooks(props: P, global: G): H;

    abstract utils(ctx: CreateUtilsCtx<P, G, H>): U;
}

/**
 * Feature module whose render path ends in `UI(utils)`.
 *
 * @template P - Props from the parent component.
 * @template G - Output of `useGlobal()` (shared dependencies / global state accessors).
 * @template H - Output of `useHooks(props, global)` — hook-driven behavior and side effects.
 * @template U - Output of `utils(ctx)` — derived values for JSX; keep lifecycle out of this layer.
 *
 * @remarks
 * Pipeline each render: `useGlobal()` → `useHooks(props, global)` → `utils({ props, global, hooks })` → `UI(utils)`.
 *
 * - **`useGlobal`** — Read injected dependencies (e.g. context providers or store bindings).
 * - **`useHooks`** — Interact with React lifecycle; receives `props` and `global`.
 * - **`utils`** — Build `U` from `{ props, global, hooks }`. Do not bypass `hooks` for lifecycle concerns.
 * - **`UI`** — Presentation only from `utils` (prefer implicit / expression-style JSX).
 */
export abstract class UIModeModule<P, G, H, U> extends BaseModule<P, G, H, U> {
    /**
     * Render from prepared `utils` only. Prefer thin, expression-style JSX so logic stays in earlier layers.
     */
    abstract UI(utils: U): ReactNode;
}

/**
 * Same layered pipeline as {@link UIModeModule}, plus a string discriminant for alternative views.
 *
 * @template P - Props from the parent component.
 * @template G - Output of `useGlobal()`.
 * @template H - Output of `useHooks(props, global)`.
 * @template U - Output of `utils({ props, global, hooks })`, fed into `condition` and `ConditionUI`.
 * @template C - String literal union tagging the active branch (enum-style discriminant).
 *
 * @remarks
 * After `utils`, implement **`condition(utils)`** → **`ConditionUI(utils, condition)`**.
 * Branching style for `condition` and mapping style for `ConditionUI` are project conventions (not enforced here).
 */
export abstract class ConditionModeModule<
    P,
    G,
    H,
    U,
    C extends string,
> extends BaseModule<P, G, H, U> {
    /**
     * Choose which view variant to render from `utils`.
     */
    abstract condition(utils: U): C;

    /**
     * Render the branch selected by `condition`.
     */
    abstract ConditionUI(utils: U, condition: C): ReactNode;
}

/** Builds a `React.FC<P>` from a {@link UIModeModule} implementation. */
export default function createModuleComponent<P, G, H, U>(
    module: UIModeModule<P, G, H, U>,
): FC<P>;

/** Builds a `React.FC<P>` from a {@link ConditionModeModule} implementation. */
export default function createModuleComponent<P, G, H, U, C extends string>(
    module: ConditionModeModule<P, G, H, U, C>,
): FC<P>;

/**
 * Wraps a module instance as a React function component.
 *
 * @typeParam P - Props accepted by the returned component.
 * @typeParam G - Global slice from `useGlobal()`.
 * @typeParam H - Hooks slice from `useHooks(props, global)`.
 * @typeParam U - Prepared utilities from `utils({ props, global, hooks })`.
 * @typeParam C - Condition tag when using {@link ConditionModeModule}.
 *
 * @param module - A {@link UIModeModule} or {@link ConditionModeModule}.
 * @returns `React.FC<P>` — external API is props-only.
 *
 * @remarks
 * Render order: `useGlobal()` → `useHooks(props, global)` → `utils({ props, global, hooks })`.
 * If `module` is a {@link ConditionModeModule}, next steps are `condition(utils)` then `ConditionUI(utils, condition)`;
 * otherwise the result is `UI(utils)`.
 */
export default function createModuleComponent<P, G, H, U, C extends string>(
    module:
        | UIModeModule<P, G, H, U>
        | ConditionModeModule<P, G, H, U, C>,
): FC<P> {
    return function Component(props: P) {
        const global = module.useGlobal();
        const hooks = module.useHooks(props, global);
        const utils = module.utils({ props, global, hooks });

        if (module instanceof ConditionModeModule) {
            const condition = module.condition(utils);
            return module.ConditionUI(utils, condition);
        }

        return module.UI(utils);
    };
}
