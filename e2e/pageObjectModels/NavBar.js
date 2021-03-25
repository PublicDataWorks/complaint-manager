const e2e = require("./e2eUtilities.js");

const navBarCommands = {
  goToArchivedCases: function () {
    return this.waitForElementPresent("@menuButton", e2e.roundtripWait)
      .click("@menuButton", e2e.logOnClick)
      .waitForElementVisible("@archivedCasesLink", e2e.rerenderWait)
      .moveToElement("@archivedCasesLink", undefined, undefined)
      .click("@archivedCasesLink", e2e.logOnClick);
  },
  goToAllExports: function () {
    return this.waitForElementPresent("@menuButton", e2e.roundtripWait)
      .click("@menuButton", e2e.logOnClick)
      .waitForElementVisible("@allExportsLink", e2e.rerenderWait)
      .click("@allExportsLink", e2e.logOnClick);
  },
  clickHamburgerButton: function () {
    return this.click("@menuButton", e2e.logOnClick);
  },
  clickLogout: function () {
    return this.waitForElementVisible("@logoutButton", e2e.rerenderWait)
      .moveToElement("@logoutButton", undefined, undefined)
      .click("@logoutButton", e2e.logOnClick);
  },
  goToComplaints: function () {
    return this.waitForElementPresent("@menuButton", e2e.roundtripWait)
      .click("@menuButton", e2e.logOnClick)
      .waitForElementVisible("@complaintsLink", e2e.rerenderWait)
      .click("@complaintsLink", e2e.logOnClick);
  }
};

module.exports = {
  commands: [navBarCommands],
  elements: {
    menuButton: { selector: "[data-testid='userAvatarButton']" },
    archivedCasesLink: {
      selector: "[data-testid='archivedCases']"
    },
    allExportsLink: {
      selector: "[data-testid='exports']"
    },
    logoutButton: {
      selector: '[data-testid="logOutButton"]'
    },
    complaintsLink: { selector: "[data-testid='complaints']" }
  }
};
