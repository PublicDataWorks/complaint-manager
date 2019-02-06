const e2e = require("./e2eUtilities.js");

const caseReviewCommands = {
  isOnPage: function() {
    this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "Review Case Details");
    return this;
  },
  clickNext: function() {
    return this.waitForElementPresent("@nextButton", e2e.rerenderWait).click(
      "@nextButton"
    );
  }
};

module.exports = {
  commands: [caseReviewCommands],
  elements: {
    nextButton: {
      selector: "[data-test='next-button']"
    },
    pageHeader: {
      selector: "[data-test='letter-review-page-header']"
    }
  }
};
