/** @typedef {import('@typescript-eslint/types').TSESTree.ClassDeclaration} ClassDeclaration */
/** @typedef {import('@typescript-eslint/types').TSESTree.Node} Node */

const UI_MODE_MODULE = "UIModeModule";
const CONDITION_MODE_MODULE = "ConditionModeModule";

/**
 * @param {string | undefined} filename
 * @returns {boolean}
 */
export function isModuleComponentFile(filename) {
    if (!filename) return false;
    const normalized = filename.replace(/\\/g, "/");
    if (normalized.endsWith("/layer/layer.tsx")) return false;
    return /\/([^/]+)\/\1\.tsx$/.test(normalized);
}

/**
 * @param {Node} node
 * @param {string} baseName
 * @returns {boolean}
 */
function extendsNamedClass(node, baseName) {
    if (node.type !== "ClassDeclaration" || !node.superClass) return false;
    const { superClass } = node;
    return superClass.type === "Identifier" && superClass.name === baseName;
}

/**
 * @param {Node} program
 * @param {string} baseName
 * @returns {ClassDeclaration[]}
 */
function findClassesExtending(program, baseName) {
    if (program.type !== "Program") return [];
    /** @type {ClassDeclaration[]} */
    const classes = [];
    for (const statement of program.body) {
        if (extendsNamedClass(statement, baseName)) {
            classes.push(/** @type {ClassDeclaration} */ (statement));
        }
    }
    return classes;
}

/**
 * @param {Node} program
 * @returns {ClassDeclaration[]}
 */
export function findUIModeModuleClasses(program) {
    return findClassesExtending(program, UI_MODE_MODULE);
}

/**
 * @param {Node} program
 * @returns {ClassDeclaration[]}
 */
export function findConditionModeModuleClasses(program) {
    return findClassesExtending(program, CONDITION_MODE_MODULE);
}

/**
 * @param {import('eslint').Rule.RuleContext} context
 * @returns {{ moduleClass: ClassDeclaration } | null}
 */
export function getUIModeModuleContext(context) {
    const filename = context.filename ?? context.getFilename?.();
    if (!isModuleComponentFile(filename)) return null;

    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const program = sourceCode.ast;
    const classes = findUIModeModuleClasses(program);
    if (classes.length !== 1) return null;

    return { moduleClass: classes[0] };
}

/**
 * @param {import('eslint').Rule.RuleContext} context
 * @returns {{ moduleClass: ClassDeclaration } | null}
 */
export function getConditionModeModuleContext(context) {
    const filename = context.filename ?? context.getFilename?.();
    if (!isModuleComponentFile(filename)) return null;

    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const program = sourceCode.ast;
    const classes = findConditionModeModuleClasses(program);
    if (classes.length !== 1) return null;

    return { moduleClass: classes[0] };
}

/**
 * UIModeModule or ConditionModeModule — exactly one module class per file.
 *
 * @param {import('eslint').Rule.RuleContext} context
 * @returns {{ moduleClass: ClassDeclaration } | null}
 */
export function getModuleComponentContext(context) {
    const filename = context.filename ?? context.getFilename?.();
    if (!isModuleComponentFile(filename)) return null;

    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const program = sourceCode.ast;
    const classes = [
        ...findUIModeModuleClasses(program),
        ...findConditionModeModuleClasses(program),
    ];
    if (classes.length !== 1) return null;

    return { moduleClass: classes[0] };
}

/**
 * @param {Node} memberNode
 * @param {ClassDeclaration} classNode
 * @returns {boolean}
 */
export function isMemberOfClass(memberNode, classNode) {
    let current = memberNode.parent;
    while (current) {
        if (current.type === "ClassBody" && current.parent === classNode) {
            return true;
        }
        if (current.type === "ClassDeclaration") return false;
        current = current.parent;
    }
    return false;
}

/**
 * @param {Node} node
 * @returns {string | null}
 */
export function getMemberKeyName(node) {
    if (node.type === "MethodDefinition" || node.type === "PropertyDefinition") {
        const { key } = node;
        if (key.type === "Identifier") return key.name;
    }
    return null;
}

/**
 * @param {Node} root
 * @param {(node: Node) => void} visit
 */
export function walkTree(root, visit) {
    /** @type {Set<Node>} */
    const seen = new Set();
    /** @type {Node[]} */
    const stack = [root];

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
                    if (child && typeof child.type === "string") {
                        stack.push(child);
                    }
                }
            } else if (typeof value.type === "string") {
                stack.push(value);
            }
        }
    }
}

/** @param {string} name @returns {boolean} */
export function isUsePrefixHookName(name) {
    return /^use[A-Z]/.test(name);
}
