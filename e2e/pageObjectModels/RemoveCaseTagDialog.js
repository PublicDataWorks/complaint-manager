const e2e = require("./e2eUtilities");

const removeCaseTagDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  clickRemoveTagButton: function() {
    this.click("@removeCaseTagButton");
  }
};

module.exports = {
  commands: [removeCaseTagDialogCommands],
  elements: {
    dialogTitle: {
      selector: "[data-test='removeCaseTagDialogTitle']"
    },
    removeCaseTagButton: {
      selector: "[data-test='removeCaseTag']"
    }
  }
};
