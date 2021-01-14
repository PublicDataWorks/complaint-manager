const e2e = require("./e2eUtilities.js");
const util = require("util");
const c2x = require("css2xpath");

const caseDashboardCommands = {
  isOnPage: function () {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "View All Cases");
  },
  hasCaseWithAC: function () {
    const customSelector = util.format(
      this.elements.caseReference.selector,
      this.api.globals.current_case
    );
    return this.pause(e2e.dataLoadWait)
      .useXpath()
      .waitForElementVisible(c2x(customSelector), e2e.roundtripWait)
      .useCss();
  },
  goToACCase: function () {
    const customSelector = util.format(
      this.elements.openCaseButton.selector,
      this.api.globals.current_case
    );
    this.api.useXpath().click(c2x(customSelector), e2e.logOnClick).useCss();
  },
  createNewCase: function () {
    return this.waitForElementVisible("@newCaseButton", e2e.rerenderWait)
      .click("@newCaseButton", e2e.logOnClick)
      .waitForElementVisible("@caseDialog", e2e.rerenderWait);
  },
  setFirstName: function (firstName) {
    return this.setValue("@firstName", firstName);
  },
  setLastName: function (lastName) {
    return this.setValue("@lastName", lastName);
  },
  setPhoneNumber: function (phoneNumber, browser) {
    this.click("@phoneNumber", e2e.logOnClick);
    browser.keys(phoneNumber);
    return this;
  },
  setIntakeSource: function () {
    return this.waitForElementPresent("@intakeSourceDropdown", e2e.rerenderWait)
      .click("@intakeSourceDropdown", e2e.logOnClick)
      .waitForElementPresent("@intakeSourceMenu", e2e.rerenderWait)
      .moveToElement("@intakeSourceToSelect", 20, 20)
      .click("@intakeSourceToSelect", e2e.logOnClick)
      .waitForElementNotPresent("@intakeSourceMenu", e2e.rerenderWait);
  },
  submitCase: function () {
    this.click("@createAndViewButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [caseDashboardCommands],
  elements: {
    pageTitle: { selector: "[data-testid='pageTitle']" },
    caseReference: {
      selector: "[data-testid='caseReference']:contains('%s')"
    },
    openCaseButton: {
      selector:
        ".//*[@data-testid='caseReference'][contains(normalize-space(),'%s')]/parent::tr/descendant::*[@data-testid='openCaseButton']"
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
      selector: '[data-option-index="1"]'
    }
  }
};
