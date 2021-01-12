const e2e = require("../e2eUtilities.js");
const path = require("path");

const attachmentCommands = {
  attachFileWithName: function(fileName) {
    return this.setValue(
      "@filenameInput",
      path.resolve(__dirname, "../../tests/images/", fileName)
    );
  },
  setDescription: function(description) {
    return this.setValue("@attachmentDescription", description);
  },

  thereAreNoAttachments: function() {
    return this.waitForElementVisible(
      "@noAttachmentsText",
      e2e.rerenderWait
    ).assert.containsText("@noAttachmentsText", "No files are attached");
  },
  confirmRemoveAttachmentInDialog: function() {
    return this.waitForElementVisible(
      "@removeAttachmentDialogButton",
      e2e.rerenderWait
    ).click("@removeAttachmentDialogButton", e2e.logOnClick);
  },
  uploadFile: function() {
    return this.waitForElementVisible(
      "@uploadAttachmentButton",
      e2e.rerenderWait
    )
      .click("@uploadAttachmentButton", e2e.logOnClick)
      .waitForElementVisible("@attachment", e2e.roundtripWait);
  },
  removeFile: function() {
    return this.waitForElementVisible(
      "@removeAttachmentButton",
      e2e.rerenderWait
    ).click("@removeAttachmentButton", e2e.logOnClick);
  }
};

const attachmentElements = {
  attachmentDescription: {
    selector: "[data-testid='attachmentDescriptionInput']"
  },
  uploadAttachmentButton: {
    selector: "[data-testid=attachmentUploadButton]"
  },
  noAttachmentsText: {
    selector: "[data-testid='noAttachmentsText']"
  },
  removeAttachmentButton: {
    selector: "[data-testid=removeAttachmentButton]"
  },
  removeAttachmentDialogButton: {
    selector: "[data-testid=confirmRemoveAttachmentButton]"
  },
  attachment: {
    selector: "[data-testid='attachmentRow']"
  },
  filenameInput: {
    selector: "input[type='file']"
  }
};

module.exports = { attachmentCommands, attachmentElements };
