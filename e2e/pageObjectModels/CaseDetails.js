const e2e = require("../e2eUtilities.js");
const path = require("path");

const caseDetailsCommands = {
  isOnPage: function() {
    return this.waitForElementVisible("@caseDetailsPage", e2e.roundtripWait);
  },
  attachFileWithName: function(fileName) {
    return this.setValue(
      "@filenameInput",
      path.resolve(__dirname, "../tests/images/", fileName)
    );
  },
  withDescription: function(description) {
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
    ).click("@removeAttachmentDialogButton");
  },
  uploadFile: function() {
    return this.waitForElementVisible(
      "@uploadAttachmentButton",
      e2e.rerenderWait
    )
      .click("@uploadAttachmentButton")
      .waitForElementVisible("@attachment", e2e.roundtripWait);
  },
  removeFile: function() {
    return this.waitForElementVisible(
      "@removeAttachmentButton",
      e2e.rerenderWait
    ).click("@removeAttachmentButton");
  }
};

module.exports = {
  commands: [caseDetailsCommands],
  elements: {
    filenameInput: {
      selector: "input[type='file']"
    },
    caseDetailsPage: {
      selector: '[data-test="case-details-page"]'
    },
    attachmentDescription: {
      selector: "[data-test='attachmentDescriptionInput']"
    },
    uploadAttachmentButton: {
      selector: "[data-test=attachmentUploadButton]"
    },
    noAttachmentsText: {
      selector: "[data-test='noAttachmentsText']"
    },
    removeAttachmentButton: {
      selector: "[data-test=removeAttachmentButton]"
    },
    removeAttachmentDialogButton: {
      selector: "[data-test=confirmRemoveAttachmentButton]"
    },
    attachment: {
      selector: "[data-test='attachmentRow']"
    }
  }
};
