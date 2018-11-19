const e2e = require("../e2eUtilities.js");

const letterPreviewCommands = {};

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
    }
  }
};
