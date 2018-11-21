const e2e = require("../e2eUtilities.js");
const {
  attachmentCommands,
  attachmentElements
} = require("./caseDetailsCommands/attachmentCommands.js");
const {
  officerCommands,
  officerElements
} = require("./caseDetailsCommands/officerCommands.js");
const {
  civilianCommands,
  civilianElements
} = require("./caseDetailsCommands/civilianCommands.js");
const {
  incidentCommands,
  incidentElements
} = require("./caseDetailsCommands/incidentCommands.js");

const caseDetailsCommands = {
  isOnPage: function() {
    return this.waitForElementVisible("@caseDetailsPage", e2e.roundtripWait);
  },

  beginLetter: function() {
    return this.waitForElementVisible("@updateStatusButton", e2e.rerenderWait)
      .assert.containsText("@updateStatusButton", "BEGIN LETTER")
      .click("@updateStatusButton");
  },
  confirmBeginLetterInDialog: function() {
    return this.waitForElementVisible(
      "@updateStatusDialogButton",
      e2e.rerenderWait
    ).click("@updateStatusDialogButton");
  }
};

module.exports = {
  commands: [
    caseDetailsCommands,
    officerCommands,
    civilianCommands,
    attachmentCommands,
    incidentCommands
  ],
  elements: Object.assign(
    {
      caseDetailsPage: {
        selector: '[data-test="case-details-page"]'
      },
      updateStatusButton: {
        selector: "[data-test='update-status-button']"
      },
      updateStatusDialogButton: {
        selector: "[data-test='update-case-status-button']"
      }
    },
    attachmentElements,
    officerElements,
    civilianElements,
    incidentElements
  )
};
