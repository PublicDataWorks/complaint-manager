const e2e = require("./e2eUtilities.js");

const caseReviewCommands = {
  isOnPage: function () {
    this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "Review Case Details");
    return this;
  },
  clickNext: function () {
    return this.waitForElementPresent("@nextButton", e2e.rerenderWait)
      .click("@nextButton", e2e.logOnClick)
      .pause(e2e.pause);
  },
  clickPreview: function () {
    return this.waitForElementPresent("@previewButton", e2e.rerenderWait).click(
      "@previewButton",
      e2e.logOnClick
    );
  }
};

module.exports = {
  commands: [caseReviewCommands],
  elements: {
    nextButton: {
      selector: "[data-testid='next-button']"
    },
    pageHeader: {
      selector: "[data-testid='letter-review-page-header']"
    },
    previewButton: {
      selector: "[data-testid='step-button-Preview']"
    }
  }
};
