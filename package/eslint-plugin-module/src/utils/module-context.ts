import type { TSESTree } from "@typescript-eslint/utils";

type RuleContextLike = {
    filename?: string;
    getFilename?: () => string;
    sourceCode?: { ast: TSESTree.Program };
    getSourceCode?: () => { ast: TSESTree.Program };
};

const UI_MODE_MODULE = "UIModeModule";
const CONDITION_MODE_MODULE = "ConditionModeModule";

type ModuleClassDeclaration = TSESTree.ClassDeclaration;

export function isModuleComponentFile(filename: string | undefined): boolean {
    if (!filename) return false;
    const normalized = filename.replace(/\\/g, "/");
    if (normalized.endsWith("/layer/src/index.tsx")) return false;
    return /\/([^/]+)\/\1\.tsx$/.test(normalized);
}

function extendsNamedClass(
    node: TSESTree.Node,
    baseName: string,
): node is ModuleClassDeclaration {
    if (node.type !== "ClassDeclaration" || !node.superClass) return false;
    const { superClass } = node;
    return superClass.type === "Identifier" && superClass.name === baseName;
}

function findClassesExtending(
    program: TSESTree.Node,
    baseName: string,
): ModuleClassDeclaration[] {
    if (program.type !== "Program") return [];
    const classes: ModuleClassDeclaration[] = [];
    for (const statement of program.body) {
        if (extendsNamedClass(statement, baseName)) {
            classes.push(statement);
        }
    }
    return classes;
}

export function findUIModeModuleClasses(
    program: TSESTree.Node,
): ModuleClassDeclaration[] {
    return findClassesExtending(program, UI_MODE_MODULE);
}

export function findConditionModeModuleClasses(
    program: TSESTree.Node,
): ModuleClassDeclaration[] {
    return findClassesExtending(program, CONDITION_MODE_MODULE);
}

type ModuleContext = {
    moduleClass: ModuleClassDeclaration;
};

function getFilename(context: RuleContextLike): string | undefined {
    return context.filename ?? context.getFilename?.();
}

function getProgram(context: RuleContextLike): TSESTree.Program {
    const sourceCode = context.sourceCode ?? context.getSourceCode?.();
    if (!sourceCode) {
        throw new Error("Rule context is missing sourceCode");
    }
    return sourceCode.ast;
}

export function getUIModeModuleContext(
    context: RuleContextLike,
): ModuleContext | null {
    const filename = getFilename(context);
    if (!isModuleComponentFile(filename)) return null;

    const classes = findUIModeModuleClasses(getProgram(context));
    if (classes.length !== 1) return null;

    return { moduleClass: classes[0] };
}

export function getConditionModeModuleContext(
    context: RuleContextLike,
): ModuleContext | null {
    const filename = getFilename(context);
    if (!isModuleComponentFile(filename)) return null;

    const classes = findConditionModeModuleClasses(getProgram(context));
    if (classes.length !== 1) return null;

    return { moduleClass: classes[0] };
}

/** UIModeModule or ConditionModeModule — exactly one module class per file. */
export function getModuleComponentContext(
    context: RuleContextLike,
): ModuleContext | null {
    const filename = getFilename(context);
    if (!isModuleComponentFile(filename)) return null;

    const classes = [
        ...findUIModeModuleClasses(getProgram(context)),
        ...findConditionModeModuleClasses(getProgram(context)),
    ];
    if (classes.length !== 1) return null;

    return { moduleClass: classes[0] };
}

export function isMemberOfClass(
    memberNode: TSESTree.Node,
    classNode: ModuleClassDeclaration,
): boolean {
    let current: TSESTree.Node | undefined = memberNode.parent;
    while (current) {
        if (current.type === "ClassBody" && current.parent === classNode) {
            return true;
        }
        if (current.type === "ClassDeclaration") return false;
        current = current.parent;
    }
    return false;
}

export function getMemberKeyName(
    node: TSESTree.MethodDefinition | TSESTree.PropertyDefinition,
): string | null {
    const { key } = node;
    if (key.type === "Identifier") return key.name;
    return null;
}

export function walkTree(
    root: TSESTree.Node,
    visit: (node: TSESTree.Node) => void,
): void {
    const seen = new Set<TSESTree.Node>();
    const stack: TSESTree.Node[] = [root];

    while (stack.length > 0) {
        const node = stack.pop();
        if (!node || typeof node !== "object" || !node.type) continue;
        if (seen.has(node)) continue;
        seen.add(node);

        visit(node);

        for (const [key, value] of Object.entries(node)) {
            if (key === "parent") continue;
            if (!value) continue;
            if (Array.isArray(value)) {
                for (let i = value.length - 1; i >= 0; i -= 1) {
                    const child = value[i];
                    if (
                        child &&
                        typeof child === "object" &&
                        "type" in child &&
                        typeof child.type === "string"
                    ) {
                        stack.push(child as TSESTree.Node);
                    }
                }
            } else if (
                typeof value === "object" &&
                "type" in value &&
                typeof value.type === "string"
            ) {
                stack.push(value as TSESTree.Node);
            }
        }
    }
}

export function isUsePrefixHookName(name: string): boolean {
    return /^use[A-Z]/.test(name);
}
