const e2e = require("./e2eUtilities.js");

const notificationDrawerCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@notificationText",
      e2e.roundtripWait
    ).assert.containsText(
      "@notificationText",
      "You have no new notifications."
    );
  }
};

module.exports = {
  commands: [notificationDrawerCommands],
  elements: {
    notificationText: { selector: "[data-test='notificationDrawer']" }
  }
};
