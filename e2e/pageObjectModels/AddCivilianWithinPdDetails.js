const e2e = require("./e2eUtilities.js");

const AddCivilainWithinPdCommands = {
  isOnPage: function () {
    return this.waitForElementVisible(
      "@submitCivilianWithinPdButton",
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
  submitCivilianWithinPd: function () {
    this.waitForElementVisible(
      "@submitCivilianWithinPdButton",
      e2e.rerenderWait
    ).click("@submitCivilianWithinPdButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [AddCivilainWithinPdCommands],
  elements: {
    roleDropdown: {
      selector: '[data-testid="roleOnCaseInput"] + div > button'
    },
    roleMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    submitCivilianWithinPdButton: {
      selector: '[data-testid="officerSubmitButton"]'
    },
    toSelect: {
      selector: "li"
    }
  }
};
