import { uiImplicitReturnRule } from "./ui-implicit-return.js";
import {
    conditionModuleTestCase,
    noopCases,
    uiModuleTestCase,
} from "../test-helpers/module-fixture.js";
import { ruleTester } from "../test-helpers/rule-tester.js";

ruleTester.run("ui-implicit-return", uiImplicitReturnRule, {
    valid: [
        uiModuleTestCase("  UI = () => <div />;"),
        uiModuleTestCase("  UI = (_u) => (<nav />);"),
        noopCases.wrongFilename("  UI() { return <div />; }"),
        conditionModuleTestCase("  UI = () => { return <div />; }"),
        noopCases.nonModuleClass("  UI = () => { return <div />; }"),
        noopCases.multipleModuleClasses("  UI = () => { return <div />; }"),
    ],
    invalid: [
        {
            ...uiModuleTestCase("  UI() { return <div />; }"),
            errors: [{ messageId: "requireImplicit" }],
        },
        {
            ...uiModuleTestCase("  UI = () => { return <div />; }"),
            errors: [{ messageId: "requireImplicit" }],
        },
    ],
});
