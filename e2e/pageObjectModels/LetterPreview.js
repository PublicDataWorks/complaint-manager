const e2e = require("./e2eUtilities.js");

const letterPreviewCommands = {
  isOnPage: function() {
    return this.waitForElementPresent("@pageHeader", e2e.rerenderWait);
  },
  letterContains: function(text) {
    this.assert.containsText("@letterBody", text);
    return this;
  },
  clickEditLetter: function() {
    return this.click("@editButton");
  },
  confirmEditLetterOnDialog: function() {
    return this.waitForElementPresent(
      "@dialogEditButton",
      e2e.rerenderWait
    ).click("@dialogEditButton");
  },
  clickSubmit: function() {
    this.waitForElementPresent("@submitButton", e2e.rerenderWait).click(
      "@submitButton"
    );
  },
  confirmSubmit: function() {
    return this.waitForElementPresent(
      "@confirmSubmitButton",
      e2e.rerenderWait
    ).click("@confirmSubmitButton");
  },
  waitForData: function() {
    this.api.pause(e2e.dataLoadWait);
    return this;
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
