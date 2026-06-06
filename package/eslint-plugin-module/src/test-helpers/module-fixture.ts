export const UI_MODULE_FILENAME =
    "/project/src/domain/fooModule/fooModule.tsx";
export const CONDITION_MODULE_FILENAME =
    "/project/src/domain/barModule/barModule.tsx";
export const NON_MODULE_FILENAME = "/project/src/foo.tsx";

const jsxLanguageOptions = {
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
} as const;

export function wrapUIModule(members: string): string {
    return `class FooModule extends UIModeModule {
${members}
}`;
}

export function wrapConditionModule(members: string): string {
    return `class BarModule extends ConditionModeModule {
${members}
}`;
}

export function uiModuleTestCase(
    members: string,
    filename: string = UI_MODULE_FILENAME,
) {
    return {
        code: wrapUIModule(members),
        filename,
        languageOptions: jsxLanguageOptions,
    };
}

export function conditionModuleTestCase(
    members: string,
    filename: string = CONDITION_MODULE_FILENAME,
) {
    return {
        code: wrapConditionModule(members),
        filename,
        languageOptions: jsxLanguageOptions,
    };
}

export const noopCases = {
    wrongFilename(members: string) {
        return uiModuleTestCase(members, NON_MODULE_FILENAME);
    },
    nonModuleClass(members: string) {
        return {
            code: `class PlainClass {
${members}
}`,
            filename: UI_MODULE_FILENAME,
            languageOptions: jsxLanguageOptions,
        };
    },
    multipleModuleClasses(members: string) {
        return {
            code: `${wrapUIModule(members)}
class SecondModule extends UIModeModule {}`,
            filename: UI_MODULE_FILENAME,
            languageOptions: jsxLanguageOptions,
        };
    },
};
