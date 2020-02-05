const e2e = require("./e2eUtilities.js");

const matrixManagerCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@pageTitle",
      e2e.roundtripWait
    ).assert.containsText("@pageTitle", "All Matrices");
  },
  pressesCreateMatrixButton: function() {
    return this.waitForElementVisible(
      "@createMatrixButton",
      e2e.roundtripWait
    ).click("@createMatrixButton");
  }
};

module.exports = {
  commands: matrixManagerCommands,
  elements: {
    pageTitle: { selector: "[data-testid='pageTitle']" },
    createMatrixButton: { selector: "[data-testid='create-matrix-button']" }
  }
};
