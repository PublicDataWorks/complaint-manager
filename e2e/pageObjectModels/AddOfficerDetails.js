const e2e = require("./e2eUtilities.js");

const AddOfficerDetailsCommands = {
  isOnPageForUnknownOfficer: function() {
    return this.waitForElementVisible(
      "@unknownOfficerMessage",
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
  submitOfficer: function() {
    this.waitForElementVisible("@submitOfficerButton", e2e.rerenderWait).click(
      "@submitOfficerButton"
    );
  }
};

module.exports = {
  commands: [AddOfficerDetailsCommands],
  elements: {
    unknownOfficerMessage: {
      selector: "[data-test='unknownOfficerMessage']"
    },
    roleDropdown: {
      selector: '[data-test="roleOnCaseInput"] + div > button'
    },
    roleMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    submitOfficerButton: {
      selector: '[data-test="officerSubmitButton"]'
    },
    toSelect: {
      selector: "li"
    }
  }
};
