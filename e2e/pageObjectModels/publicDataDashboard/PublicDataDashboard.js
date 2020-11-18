const e2e = require("../e2eUtilities.js");

const publicDataDashboardCommands = {
  isOnPage: function () {
    return this.waitForElementVisible(
      "@introText",
      e2e.roundtripWait
    ).assert.containsText("@introText", "OIPM");
  }
};

module.exports = {
  commands: [publicDataDashboardCommands],
  elements: {
    introText: { selector: "[data-testid='introText']" }
  }
};
