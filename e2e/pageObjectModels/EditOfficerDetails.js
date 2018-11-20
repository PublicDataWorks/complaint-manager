const e2e = require("../e2eUtilities.js");

const EditOfficerDetailsCommands = {
  isOnPageForUnknownOfficer: function() {
    this.waitForElementVisible("@unknownOfficerMessage", e2e.rerenderWait)
      .waitForElementVisible("@pageTitle", e2e.rerenderWait)
      .assert.containsText("@pageTitle", "Edit Officer");
    return this;
  },
  isOnPageForKnownOfficer: function() {
    this.waitForElementPresent("@pageTitle", e2e.rerenderWait)
      .waitForElementNotPresent("@unknownOfficerMessage", e2e.rerenderWait)
      .assert.containsText("@pageTitle", "Edit Officer");
    return this;
  },
  changeOfficer: function() {
    return this.waitForElementVisible(
      "@changeOfficerButton",
      e2e.rerenderWait
    ).click("@changeOfficerButton");
  },
  saveOfficer: function() {
    return this.waitForElementVisible(
      "@saveOfficerButton",
      e2e.rerenderWait
    ).click("@saveOfficerButton");
  }
};

module.exports = {
  commands: [EditOfficerDetailsCommands],
  elements: {
    pageTitle: {
      selector: "[data-test='pageTitle']"
    },
    unknownOfficerMessage: {
      selector: "[data-test='unknown-officer-message']"
    },
    changeOfficerButton: {
      selector: '[data-test="changeOfficerLink"]'
    },
    saveOfficerButton: {
      selector: '[data-test="officerSubmitButton"]'
    }
  }
};
