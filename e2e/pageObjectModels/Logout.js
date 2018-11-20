const e2e = require("../e2eUtilities.js");

const logoutCommands = {
  clickGearButton: function() {
    return this.click("@gearButton");
  },
  clickLogout: function() {
    return this.waitForElementVisible("@logoutButton", e2e.rerenderWait).click(
      "@logoutButton"
    );
  }
};

module.exports = {
  commands: [logoutCommands],
  elements: {
    gearButton: {
      selector: '[data-test="gearButton"]'
    },
    logoutButton: {
      selector: '[data-test="logOutButton"]'
    }
  }
};
