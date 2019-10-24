const e2e = require("./e2eUtilities.js");

const disciplinaryProceedingsCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "All Disciplinary Proceedings");
  },
  displaysUserDropDown: function() {
    this.waitForElementVisible(
      "@usersDropdown",
      e2e.roundtripWait
    ).click("@usersDropdown")
      .waitForElementVisible("@usersList", e2e.rerenderWait)
      .api.pause(e2e.dataLoadWait);
    return this.click("@lastUser");

  }
};

module.exports = {
  commands: disciplinaryProceedingsCommands,
  elements: {
    pageTitle: { selector: "[data-test='pageTitle']" },
    usersDropdown: {selector: "[data-test='usersDropdown']"},
    usersList: {selector: "[role='listbox']"},
    lastUser: {selector: '[role="listbox"] > div > li:last-child'}
  }
};
