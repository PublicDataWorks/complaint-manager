const e2e = require("./e2eUtilities.js");

const reviewAndApproveCommands = {
  isOnPage: function() {
    return this.waitForElementPresent("@pageHeader", e2e.rerenderWait);
  },
  clickApproveLetter: function() {
    this.api.pause(e2e.dataLoadWait);
    return this.click("@reviewAndApproveButton");
  },
  clickApproveLetterOnDialog: function() {
    return this.waitForElementPresent(
      "@dialogApproveButton",
      e2e.rerenderWait
    ).click("@dialogApproveButton");
  }
};

module.exports = {
  commands: [reviewAndApproveCommands],
  elements: {
    pageHeader: {
      selector: '[data-testid="review-and-approve-page-header"]'
    },
    reviewAndApproveButton: {
      selector: '[data-testid="approve-letter-button"]'
    },
    dialogApproveButton: {
      selector: '[data-testid="update-case-status-button"]'
    }
  }
};
