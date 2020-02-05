const e2e = require("./e2eUtilities.js");

const caseDashboardCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "View All Cases");
  },
  hasCaseWithAC: function() {
    return this.waitForElementVisible(
      "@caseReference",
      e2e.roundtripWait
    ).assert.containsText("@caseReference", "AC");
  },
  goToACCase: function() {
    this.click("@openCaseButton");
  },
  createNewCase: function() {
    return this.waitForElementVisible("@newCaseButton", e2e.rerenderWait)
      .click("@newCaseButton")
      .waitForElementVisible("@caseDialog", e2e.rerenderWait);
  },
  setFirstName: function(firstName) {
    return this.setValue("@firstName", firstName);
  },
  setLastName: function(lastName) {
    return this.setValue("@lastName", lastName);
  },
  setPhoneNumber: function(phoneNumber, browser) {
    this.click("@phoneNumber");
    browser.keys(phoneNumber);
    return this;
  },
  setIntakeSourceId: function() {
    return this.waitForElementPresent("@intakeSourceDropdown", e2e.rerenderWait)
      .click("@intakeSourceDropdown")
      .waitForElementPresent("@intakeSourceMenu", e2e.rerenderWait)
      .moveToElement("@intakeSourceToSelect", 20, 20)
      .click("@intakeSourceToSelect")
      .waitForElementNotPresent("@intakeSourceMenu", e2e.rerenderWait);
  },
  submitCase: function() {
    this.click("@createAndViewButton");
  }
};

module.exports = {
  commands: [caseDashboardCommands],
  elements: {
    pageTitle: { selector: "[data-testid='pageTitle']" },
    caseReference: {
      selector: "[data-testid='caseReference']"
    },
    openCaseButton: {
      selector: "[data-testid='openCaseButton']"
    },
    newCaseButton: {
      selector: "[data-testid='createCaseButton'] > span"
    },
    caseDialog: {
      selector: "[data-testid='createCaseDialogTitle']"
    },
    firstName: {
      selector: "[data-testid=firstNameInput]"
    },
    lastName: {
      selector: "[data-testid=lastNameInput]"
    },
    phoneNumber: {
      selector: "[data-testid=phoneNumberInput]"
    },
    createAndViewButton: {
      selector: "button[data-testid=createAndView]"
    },
    intakeSourceDropdown: {
      selector: '[data-testid="intakeSourceInput"]+div>button'
    },
    intakeSourceMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    intakeSourceToSelect: {
      selector: '[data-option-index="2"]'
    }
  }
};
