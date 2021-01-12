const e2e = require("./e2eUtilities.js");

const archivedCasesCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "View Archived Cases");
  },
  openArchivedCase: function() {
    return this.waitForElementVisible(
      "@openCaseButton",
      e2e.roundtripWait
    ).click("@openCaseButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [archivedCasesCommands],
  elements: {
    pageTitle: { selector: "[data-testid='pageTitle']" },
    openCaseButton: {
      selector: '[data-testid="openCaseButton"]'
    }
  }
};
