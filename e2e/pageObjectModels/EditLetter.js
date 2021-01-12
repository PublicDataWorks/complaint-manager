const e2e = require("./e2eUtilities.js");

const editLetterCommands = {
  isOnPage: function() {
    this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "Edit Letter");
    return this;
  },
  makeEditsWithText: function(text) {
    this.click("@editor").api.keys(text, e2e.logOnClick);
    return this;
  },
  saveEdits: function() {
    return this.waitForElementPresent("@saveButton", e2e.rerenderWait).click(
      "@saveButton"
    );
  }
};

module.exports = {
  commands: [editLetterCommands],
  elements: {
    pageHeader: {
      selector: '[data-testid="edit-letter-page-header"]'
    },
    saveButton: {
      selector: "[data-testid='saveButton'"
    },
    editor: {
      selector: ".ql-editor"
    }
  }
};
