const e2e = require("../e2eUtilities.js");

const archivedCasesCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "View Archived Cases");
  },
  openArchivedCase: function() {
    return this.click("@openCaseButton");
  }
};

module.exports = {
  commands: [archivedCasesCommands],
  elements: {
    pageTitle: { selector: "[data-test='pageTitle']" },
    openCaseButton: {
      selector: '[data-test="openCaseButton"]'
    }
  }
};
