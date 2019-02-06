const e2e = require("./e2eUtilities.js");

const AddOfficerDetailsCommands = {
  isOnPageForUnknownOfficer: function() {
    return this.waitForElementVisible(
      "@unknownOfficerMessage",
      e2e.rerenderWait
    );
  },
  selectRole: function(role) {
    return this.waitForElementVisible("@roleDropdown", e2e.rerenderWait)
      .click("@roleDropdown")
      .waitForElementVisible("@roleMenu", e2e.rerenderWait)
      .click(`li[data-value=${role}`)
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
      selector: "[data-test='unknown-officer-message']"
    },
    roleDropdown: {
      selector: '[data-test="roleOnCaseDropdown"] > div > div > div'
    },
    roleMenu: {
      selector: '[id="menu-roleOnCase"]'
    },
    submitOfficerButton: {
      selector: '[data-test="officerSubmitButton"]'
    }
  }
};
