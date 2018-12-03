const e2e = require("../e2eUtilities.js");

const caseDashboardCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "View All Cases");
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
    browser
      .keys("\uE012") // left arrow key
      .keys(phoneNumber);
    return this;
  },
  submitCase: function() {
    this.click("@createAndViewButton");
  }
};

module.exports = {
  commands: [caseDashboardCommands],
  elements: {
    pageTitle: { selector: "[data-test='pageTitle']" },
    newCaseButton: {
      selector: "[data-test='createCaseButton']"
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
    }
  }
};
