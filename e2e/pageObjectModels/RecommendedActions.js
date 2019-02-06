const e2e = require("./e2eUtilities.js");

const recommendedActionsCommands = {
  isOnPage: function() {
    this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "Recommended Actions");
    return this;
  },
  toggleRetaliationConcerns: function() {
    return this.click("@retaliationConcerns");
  },
  toggleNthOfficersNthRecommendedAction: function(officer, n) {
    return this.click(`[data-test="letterOfficers[${officer}]-${n}"] input`);
  },
  clickNext: function() {
    return this.waitForElementPresent("@nextButton", e2e.rerenderWait).click(
      "@nextButton"
    );
  }
};

module.exports = {
  commands: [recommendedActionsCommands],
  elements: {
    pageHeader: {
      selector: '[data-test="recommended-actions-page-header"]'
    },
    retaliationConcerns: {
      selector: '[data-test="include-retaliation-concerns-field"] input'
    },
    nextButton: {
      selector: "[data-test='next-button']"
    }
  }
};
