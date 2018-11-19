const e2e = require("../e2eUtilities.js");

const letterPreviewCommands = {
  isOnPage: function() {
    return this.waitForElementPresent("@pageHeader", e2e.rerenderWait);
  },
  letterContains: function(text) {
    this.assert.containsText("@letterBody", text);
    return this;
  },
  clickEditLetter: function() {
    return this.click("@editButton").waitForElementPresent(
      "@dialogEditButton",
      e2e.rerenderWait
    );
  },
  confirmEditLetterOnDialog: function() {
    return this.click("@dialogEditButton");
  },
  clickSubmit: function() {
    return this.click("@submitButton").waitForElementPresent(
      "@confirmSubmitButton",
      e2e.rerenderWait
    );
  },
  confirmSubmit: function() {
    return this.click("@confirmSubmitButton");
  }
};

module.exports = {
  commands: [letterPreviewCommands],
  elements: {
    letterBody: {
      selector: ".letter-preview"
    },
    editButton: {
      selector: '[data-test="edit-confirmation-dialog-button"]'
    },
    dialogEditButton: {
      selector: '[data-test="edit-letter-button"]'
    },
    pageHeader: {
      selector: '[data-test="preview-page-header"]'
    },
    submitButton: {
      selector: "[data-test='submit-for-review-button']"
    },
    confirmSubmitButton: {
      selector: '[data-test="update-case-status-button"]'
    }
  }
};
