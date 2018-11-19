const e2e = require("../e2eUtilities.js");

const caseReviewCommands = {
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
    }
  }
};
