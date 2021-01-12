const e2e = require("./e2eUtilities.js");

const recommendedActionsCommands = {
  isOnPage: function () {
    this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "Recommended Actions");
    return this;
  },
  toggleRetaliationConcerns: function () {
    return e2e.waitMoveAndClick(this, "@retaliationConcerns");
  },
  toggleNthOfficersNthRecommendedAction: function (officer, n) {
    return e2e.waitMoveAndClick(
      this,
      `[data-testid="letterOfficers[${officer}]-${n}"] input`
    );
  },
  clickNext: function () {
    return this.waitForElementPresent("@nextButton", e2e.rerenderWait)
      .click("@nextButton", e2e.logOnClick)
      .pause(e2e.dataLoadWait);
  },
  selectClassification: function (classificationName) {
    return e2e.waitMoveAndClick(
      this,
      `[data-testid=${classificationName}] input`
    );
  },
  classificationsAreDisabled: function () {
    this.waitForElementPresent(
      "@useOfForce",
      e2e.rerenderWait
    ).assert.attributeEquals("@useOfForce", "disabled", "true");
    this.waitForElementPresent(
      "@criminalMisconduct",
      e2e.rerenderWait
    ).assert.attributeEquals("@criminalMisconduct", "disabled", "true");
    this.waitForElementPresent(
      "@seriousMisconduct",
      e2e.rerenderWait
    ).assert.attributeEquals("@seriousMisconduct", "disabled", "true");
    return this;
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
    },
    criminalMisconduct: {
      selector: "[data-testid='criminal-misconduct'] input"
    },
    seriousMisconduct: {
      selector: "[data-testid='serious-misconduct'] input"
    }
  }
};
