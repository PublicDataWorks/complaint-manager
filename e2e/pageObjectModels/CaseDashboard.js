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
    pageTitle: { selector: "[data-test='pageTitle']" },
    caseReference: {
      selector: "[data-test='caseReference']"
    },
    openCaseButton: {
      selector: "[data-test='openCaseButton']"
    },
    newCaseButton: {
      selector: "[data-test='createCaseButton'] > span"
    },
    caseDialog: {
      selector: "[data-test='createCaseDialogTitle']"
    },
    firstName: {
      selector: "[data-test=firstNameInput]"
    },
    lastName: {
      selector: "[data-test=lastNameInput]"
    },
    phoneNumber: {
      selector: "[data-test=phoneNumberInput]"
    },
    createAndViewButton: {
      selector: "button[data-test=createAndView]"
    },
    intakeSourceDropdown: {
      selector: '[data-test="intakeSourceInput"]+div>button'
    },
    intakeSourceMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    intakeSourceToSelect: {
      selector: '[data-option-index="2"]'
    }
  }
};
