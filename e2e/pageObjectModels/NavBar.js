const e2e = require("./e2eUtilities.js");

const navBarCommands = {
  goToArchivedCases: function() {
    return this.waitForElementPresent("@menuButton", e2e.roundtripWait)
      .click("@menuButton")
      .waitForElementVisible("@archivedCasesLink", e2e.rerenderWait)
      .click("@archivedCasesLink");
  },
  clickGearButton: function() {
    return this.click("@menuButton");
  },
  clickLogout: function() {
    return this.waitForElementVisible("@logoutButton", e2e.rerenderWait)
      .moveToElement("@logoutButton", undefined, undefined)
      .click("@logoutButton");
  },
  goToComplaints: function() {
    return this.waitForElementPresent("@menuButton", e2e.roundtripWait)
      .click("@menuButton")
      .waitForElementVisible("@complaintsLink", e2e.rerenderWait)
      .click("@complaintsLink");
  }
};

module.exports = {
  commands: [navBarCommands],
  elements: {
    menuButton: { selector: "[data-testid='gearButton']" },
    archivedCasesLink: {
      selector: "[data-testid='archivedCases']"
    },
    logoutButton: {
      selector: '[data-testid="logOutButton"]'
    },
    complaintsLink: { selector: "[data-testid='complaints']" }
  }
};
