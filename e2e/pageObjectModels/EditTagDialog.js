const e2e = require("./e2eUtilities.js");
const util = require("util");
const c2x = require("css2xpath");

const editTagDialogCommands = {
  isDialogVisible: function () {
    return this.waitForElementVisible("@textBox", e2e.roundtripWait);
  },
  enterText: function (text) {
    return this.setValue("@textBox", text);
  },
  tab: function () {
    this.api.keys([this.api.Keys.TAB]);
    return this;
  },
  clear: function () {
    this.click("@textBox").api.keys(
      Array(30)
        .fill(this.api.Keys.BACK_SPACE)
        .concat(Array(30).fill(this.api.Keys.DELETE))
    );
    return this;
  },
  save: function () {
    return this.waitForElementVisible("@saveButton", e2e.rerenderWait).click(
      "@saveButton",
      e2e.logOnClick
    );
  },
  cancel: function () {
    return this.click("@cancelButton");
  },
  saveDisabled: function () {
    return this.assert.attributeEquals("@saveButton", "disabled", "true");
  },
  hasValidationError: function () {
    return this.waitForElementVisible("@validationError", e2e.rerenderWait);
  }
};

module.exports = {
  commands: [editTagDialogCommands],
  elements: {
    textBox: {
      selector: '[data-testid="editTagTextBox"]'
    },
    cancelButton: {
      selector: '[data-testid="editTagCancelButton"]'
    },
    saveButton: {
      selector: 'button[data-testid="saveTagButton"]'
    },
    validationError: {
      selector: ".Mui-error"
    }
  }
};
