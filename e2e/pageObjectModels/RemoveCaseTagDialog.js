const e2e = require("./e2eUtilities");

const removeCaseTagDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  clickRemoveTagButton: function() {
    this.click("@removeCaseTagButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [removeCaseTagDialogCommands],
  elements: {
    dialogTitle: {
      selector: "[data-testid='removeCaseTagDialogTitle']"
    },
    removeCaseTagButton: {
      selector: "[data-testid='removeCaseTag']"
    }
  }
};
