const e2e = require("./e2eUtilities.js");

const disciplinaryProceedingsCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "All Disciplinary Proceedings");
  }
};

module.exports = {
  commands: disciplinaryProceedingsCommands,
  elements: {
    pageTitle: { selector: "[data-test='pageTitle']" }
  }
};
