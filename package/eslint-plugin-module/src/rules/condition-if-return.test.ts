import { conditionIfReturnRule } from "./condition-if-return.js";
import {
    conditionModuleTestCase,
    noopCases,
    uiModuleTestCase,
} from "../test-helpers/module-fixture.js";
import { ruleTester } from "../test-helpers/rule-tester.js";

ruleTester.run("condition-if-return", conditionIfReturnRule, {
    valid: [
        conditionModuleTestCase(`  condition() {
    if (a) return "x";
    else return "y";
  }`),
        conditionModuleTestCase(`  condition() {
    if (a) return "a";
    else if (b) return "b";
    else return "c";
  }`),
        noopCases.wrongFilename(`  condition() {
    return utils.kind;
  }`),
        uiModuleTestCase(`  condition() {
    return utils.kind;
  }`),
        noopCases.nonModuleClass(`  condition() {
    return utils.kind;
  }`),
        noopCases.multipleModuleClasses(`  condition() {
    return utils.kind;
  }`),
    ],
    invalid: [
        {
            ...conditionModuleTestCase(`  condition() {
    return utils.kind;
  }`),
            errors: [{ messageId: "requireIfChain" }],
        },
        {
            ...conditionModuleTestCase(`  condition() {
    switch (x) {
      case "a": return "a";
      default: return "b";
    }
  }`),
            errors: [{ messageId: "requireIfChain" }],
        },
        {
            ...conditionModuleTestCase(`  condition() {
    if (a) return 1;
    else return "b";
  }`),
            errors: [{ messageId: "requireIfChain" }],
        },
        {
            ...conditionModuleTestCase('  condition = () => "a";'),
            errors: [{ messageId: "requireIfChain" }],
        },
    ],
});
