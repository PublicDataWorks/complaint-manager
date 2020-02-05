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
    return this.click(`[data-testid="letterOfficers[${officer}]-${n}"] input`);
  },
  clickNext: function() {
    return this.waitForElementPresent("@nextButton", e2e.rerenderWait).click(
      "@nextButton"
    );
  },
  selectClassification: function(classificationName) {
    return this.click(`[data-testid=${classificationName}] input`);
  },
  classificationsAreDisabled: function() {
    return this.waitForElementPresent(
      "@useOfForce",
      e2e.rerenderWait
    ).assert.attributeEquals("@useOfForce", "disabled", "true");
  }
};

module.exports = {
  commands: [recommendedActionsCommands],
  elements: {
    pageHeader: {
      selector: '[data-testid="recommended-actions-page-header"]'
    },
    retaliationConcerns: {
      selector: '[data-testid="include-retaliation-concerns-field"] input'
    },
    nextButton: {
      selector: "[data-testid='next-button']"
    },
    useOfForce: {
      selector: "[data-testid='use-of-force'] input"
    }
  }
};
