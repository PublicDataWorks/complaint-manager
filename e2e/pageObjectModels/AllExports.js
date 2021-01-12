const e2e = require("./e2eUtilities.js");

const allExportCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "Data Export");
  },
  exportAllCases: function() {
    return this.waitForElementVisible(
      "@clickExportAllCasesButton",
      e2e.roundtripWait
    ).click("@clickExportAllCasesButton", e2e.logOnClick);
  },
  confirmExportInDialog: function() {
    return this.waitForElementVisible(
      "@clickExportButtonInDialog",
      e2e.roundtripWait
    ).click("@clickExportButtonInDialog", e2e.logOnClick);
  },
  waitForJobCompletion: function() {
    return this.waitForElementNotPresent(
      "@checkForCircularProgress",
      e2e.roundtripWait
    );
  }
};

module.exports = {
  commands: [allExportCommands],
  elements: {
    pageTitle: { selector: "[data-testid='pageTitle']" },
    clickExportAllCasesButton: {
      selector: '[data-testid="exportAllCases"]'
    },
    clickExportButtonInDialog: {
      selector: "[data-testid='exportAuditLogButton']"
    },
    checkForCircularProgress: {
      selector: "[data-testid='waitingForJob']"
    }
  }
};
