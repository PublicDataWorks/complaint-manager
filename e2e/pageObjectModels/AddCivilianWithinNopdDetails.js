const e2e = require("./e2eUtilities.js");

const AddCivilainWithinNopdCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@submitCivilianWithinNopdButton",
      e2e.rerenderWait
    );
  },
  selectRole: function(roleId) {
    return this.waitForElementPresent("@roleDropdown", e2e.rerenderWait)
      .click("@roleDropdown")
      .waitForElementPresent("@roleMenu", e2e.rerenderWait)
      .click({ selector: "@toSelect", index: roleId })
      .waitForElementNotPresent("@roleMenu", e2e.rerenderWait);
  },
  submitCivilianWithinNopd: function() {
    this.waitForElementVisible(
      "@submitCivilianWithinNopdButton",
      e2e.rerenderWait
    ).click("@submitCivilianWithinNopdButton");
  }
};

module.exports = {
  commands: [AddCivilainWithinNopdCommands],
  elements: {
    roleDropdown: {
      selector: '[data-test="roleOnCaseInput"] + div > button'
    },
    roleMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    submitCivilianWithinNopdButton: {
      selector: '[data-test="officerSubmitButton"]'
    },
    toSelect: {
      selector: "li"
    }
  }
};
