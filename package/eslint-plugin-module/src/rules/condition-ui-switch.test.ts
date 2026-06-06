import { conditionUiSwitchRule } from "./condition-ui-switch.js";
import {
    conditionModuleTestCase,
    noopCases,
    uiModuleTestCase,
} from "../test-helpers/module-fixture.js";
import { ruleTester } from "../test-helpers/rule-tester.js";

ruleTester.run("condition-ui-switch", conditionUiSwitchRule, {
    valid: [
        conditionModuleTestCase(`  ConditionUI() {
    switch (condition) {
      case "a":
        return <div />;
      default:
        return null;
    }
  }`),
        conditionModuleTestCase(`  ConditionUI() {
    switch (condition) {
      case "a":
        return <div />;
      default:
        return;
    }
  }`),
        noopCases.wrongFilename(`  ConditionUI() {
    if (condition === "a") return <div />;
  }`),
        uiModuleTestCase(`  ConditionUI() {
    if (condition === "a") return <div />;
  }`),
        noopCases.nonModuleClass(`  ConditionUI() {
    if (condition === "a") return <div />;
  }`),
        noopCases.multipleModuleClasses(`  ConditionUI() {
    if (condition === "a") return <div />;
  }`),
    ],
    invalid: [
        {
            ...conditionModuleTestCase(`  ConditionUI() {
    switch (utils.kind) {
      case "a":
        return <div />;
      default:
        return null;
    }
  }`),
            errors: [{ messageId: "requireSwitch" }],
        },
        {
            ...conditionModuleTestCase(`  ConditionUI() {
    if (condition === "a") return <div />;
  }`),
            errors: [{ messageId: "requireSwitch" }],
        },
        {
            ...conditionModuleTestCase(`  ConditionUI() {
    switch (condition) {
      case "a": {
        const x = 1;
        return <div />;
      }
      default:
        return null;
    }
  }`),
            errors: [{ messageId: "requireSwitch" }],
        },
        {
            ...conditionModuleTestCase(`  ConditionUI() {
    switch (condition) {
      case "a":
        return <div />;
      case "b":
    }
  }`),
            errors: [{ messageId: "requireSwitch" }],
        },
    ],
});
