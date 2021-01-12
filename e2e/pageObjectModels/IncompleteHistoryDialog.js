const e2e = require("./e2eUtilities");

const incompleteHistoryDialogCommands = {
  incompleteOfficerHistoryDialogIsOpen: function() {
    return this.waitForElementVisible(
      "@incompleteOfficerHistoryDialogTitle",
      e2e.rerenderWait
    );
  },
  incompleteClassificationsDialogIsOpen: function() {
    return this.waitForElementVisible(
      "@incompleteClassificationsDialogTitle",
      e2e.rerenderWait
    );
  },
  clickReturn: function() {
    return this.click("@returnButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [incompleteHistoryDialogCommands],
  elements: {
    incompleteOfficerHistoryDialogTitle: {
      selector: "[data-testid='incomplete-officer-history-title']"
    },
    incompleteClassificationsDialogTitle: {
      selector: "[data-testid='incomplete-classifications-title']"
    },
    returnButton: {
      selector: "[data-testid='close-incomplete-history-dialog']"
    }
  }
};
