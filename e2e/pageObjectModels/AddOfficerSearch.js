const e2e = require("../e2eUtilities.js");

const addOfficerCommands = {
  isOnPage: function() {
    this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "Add Officer");
    return this;
  },
  clickUnknownOfficerLink: function() {
    return this.waitForElementVisible(
      "@unknownOfficerLink",
      e2e.rerenderWait
    ).click("@unknownOfficerLink");
  }
};

module.exports = {
  commands: [addOfficerCommands],
  elements: {
    pageHeader: {
      selector: '[data-test="officer-search-title"]'
    },
    unknownOfficerLink: {
      selector: '[data-test="selectUnknownOfficerLink"]'
    }
  }
};
