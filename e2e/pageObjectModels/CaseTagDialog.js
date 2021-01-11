const e2e = require("./e2eUtilities");

const caseTagDialogCommands = {
  dialogIsOpen: function () {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  setTagValue: function (tagName) {
    this.waitForElementVisible("@tagInputField")
      .setValue("@tagInputField", [tagName])
      .api.pause(e2e.pause);

    return this;
  },
  clickSubmitNewTag: function () {
    return this.click("@submitTagButton").pause(e2e.pause);
  }
};

module.exports = {
  commands: [caseTagDialogCommands],
  elements: {
    dialogTitle: {
      selector: "[data-testid='caseTagDialogTitle']"
    },
    tagInputField: {
      selector: "[data-testid='caseTagDropdownInput']"
    },
    submitTagButton: {
      selector: "[data-testid='caseTagSubmitButton']"
    }
  }
};
