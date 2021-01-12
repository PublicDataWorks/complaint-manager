const e2e = require("./e2eUtilities");

const caseTagDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  setActionTaken: function() {
    return this.waitForElementPresent("@actionTakenField", e2e.rerenderWait)
      .click("@actionTakenField", e2e.logOnClick)
      .waitForElementPresent("@actionTakenMenu", e2e.rerenderWait)
      .moveToElement("@actionTakenToSelect", 20, 20)
      .click("@actionTakenToSelect", e2e.logOnClick)
      .waitForElementNotPresent("@actionTakenMenu", e2e.rerenderWait);
  },
  writeCaseNote: function(caseNote) {
    return this.setValue("@caseNoteField", caseNote);
  },
  tagPersonInCaseNote: function(taggedPerson) {
    this.setValue("@caseNoteField", "@");
    this.waitForElementVisible("@userDropdown", e2e.rerenderWait);
    this.setValue("@caseNoteField", [
      taggedPerson,
      this.api.Keys.ENTER
    ]).api.pause(e2e.pause);
    return this;
  },
  clickSubmitButton: function() {
    return this.click("@submitCaseNoteButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [caseTagDialogCommands],
  elements: {
    dialogTitle: {
      selector: "[data-testid='caseNoteDialogTitle']"
    },
    actionTakenField: {
      selector: "[data-testid='actionTakenInput']+div>button"
    },
    actionTakenMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    actionTakenToSelect: {
      selector: '[data-option-index="2"]'
    },
    caseNoteField: {
      selector: "[data-testid='notesInput']"
    },
    userDropdown: {
      selector: "[data-testid='user-dropdown']"
    },
    submitCaseNoteButton: {
      selector: "[data-testid='submitButton']"
    }
  }
};
