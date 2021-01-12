const e2e = require("./e2eUtilities.js");

const AddCivilainWithinNopdCommands = {
  isOnPage: function () {
    return this.waitForElementVisible(
      "@submitCivilianWithinNopdButton",
      e2e.rerenderWait
    );
  },
  selectRole: function (roleId) {
    return this.waitForElementPresent("@roleDropdown", e2e.rerenderWait)
      .click("@roleDropdown", e2e.logOnClick)
      .waitForElementPresent("@roleMenu", e2e.rerenderWait)
      .click({ selector: "@toSelect", index: roleId }, e2e.logOnClick)
      .waitForElementNotPresent("@roleMenu", e2e.rerenderWait);
  },
  submitCivilianWithinNopd: function () {
    this.waitForElementVisible(
      "@submitCivilianWithinNopdButton",
      e2e.rerenderWait
    ).click("@submitCivilianWithinNopdButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [AddCivilainWithinNopdCommands],
  elements: {
    roleDropdown: {
      selector: '[data-testid="roleOnCaseInput"] + div > button'
    },
    roleMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    submitCivilianWithinNopdButton: {
      selector: '[data-testid="officerSubmitButton"]'
    },
    toSelect: {
      selector: "li"
    }
  }
};
