const e2e = require("./e2eUtilities.js");

const letterPreviewCommands = {
  isOnPage: function () {
    return this.waitForElementPresent("@pageHeader", e2e.rerenderWait);
  },
  letterContains: function (text) {
    this.assert.containsText("@letterBody", text);
    return this;
  },
  clickEditLetter: function () {
    return this.click("@editButton", e2e.logOnClick);
  },
  confirmEditLetterOnDialog: function () {
    return this.waitForElementPresent(
      "@dialogEditButton",
      e2e.rerenderWait
    ).click("@dialogEditButton", e2e.logOnClick);
  },
  clickSubmit: function () {
    e2e.waitMoveAndClick(this, "@submitButton");
  },
  confirmSubmit: function () {
    return this.waitForElementPresent(
      "@confirmSubmitButton",
      e2e.rerenderWait
    ).click("@confirmSubmitButton", e2e.logOnClick);
  },
  waitForData: function () {
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
      selector: '[data-testid="edit-confirmation-dialog-button"]'
    },
    dialogEditButton: {
      selector: '[data-testid="edit-letter-button"]'
    },
    pageHeader: {
      selector: '[data-testid="preview-page-header"]'
    },
    submitButton: {
      selector: "[data-testid='submit-for-review-button']"
    },
    confirmSubmitButton: {
      selector: '[data-testid="update-case-status-button"]'
    }
  }
};
