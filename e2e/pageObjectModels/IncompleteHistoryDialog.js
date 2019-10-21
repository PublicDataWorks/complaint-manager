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
    return this.click("@returnButton");
  }
};

module.exports = {
  commands: [incompleteHistoryDialogCommands],
  elements: {
    incompleteOfficerHistoryDialogTitle: {
      selector: "[data-test='incomplete-officer-history-title']"
    },
    incompleteClassificationsDialogTitle: {
      selector: "[data-test='incomplete-classifications-title']"
    },
    returnButton: {
      selector: "[data-test='close-incomplete-history-dialog']"
    }
  }
};
