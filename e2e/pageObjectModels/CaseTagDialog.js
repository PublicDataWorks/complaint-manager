const e2e = require("./e2eUtilities");

const caseTagDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  setTagValue: function(tagName) {
    this.setValue("@tagInputField", [tagName, this.api.Keys.ENTER]).api.pause(
      e2e.pause
    );

    return this;
  },
  clickSubmitNewTag: function() {
    return this.click("@submitTagButton");
  }
};

module.exports = {
  commands: [caseTagDialogCommands],
  elements: {
    dialogTitle: {
      selector: "[data-test='caseTagDialogTitle']"
    },
    tagInputField: {
      selector: "[data-test='caseTagDropdownInput']"
    },
    submitTagButton: {
      selector: "[data-test='caseTagSubmitButton']"
    }
  }
};
