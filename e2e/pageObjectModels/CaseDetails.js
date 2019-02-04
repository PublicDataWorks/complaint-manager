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
  confirmUpdateStatusInDialog: function() {
    return this.waitForElementVisible(
      "@updateStatusDialogButton",
      e2e.rerenderWait
    ).click("@updateStatusDialogButton");
  },
  clickReviewAndApproveButton: function() {
    return this.click("@reviewAndApproveButton");
  },
  closeCase: function() {
    return this.waitForElementVisible("@updateStatusButton", e2e.rerenderWait)
      .assert.containsText("@updateStatusButton", "MARK AS CLOSED")
      .click("@updateStatusButton");
  },
  archiveCase: function() {
    return this.waitForElementVisible(
      "@archiveCaseButton",
      e2e.rerenderWait
    ).click("@archiveCaseButton");
  },
  confirmArchiveInDialog: function() {
    return this.waitForElementVisible(
      "@archiveCaseButtonInDialog",
      e2e.rerenderWait
    ).click("@archiveCaseButtonInDialog");
  },
  restoreCase: function() {
    return this.waitForElementVisible(
      "@restoreCaseButton",
      e2e.rerenderWait
    ).click("@restoreCaseButton");
  },
  confirmRestoreInDialog: function() {
    return this.waitForElementVisible(
      "@restoreCaseButtonInDialog",
      e2e.rerenderWait
    ).click("@restoreCaseButtonInDialog");
  },
  goBackToAllCases: function() {
    return this.waitForElementNotPresent(
      "@restoreCaseButtonInDialog",
      e2e.rerenderWait
    ).click("@backToAllCasesButton");
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
      reviewAndApproveButton: {
        selector: "[data-test='review-and-approve-letter-button']"
      },
      updateStatusDialogButton: {
        selector: "[data-test='update-case-status-button']"
      },
      archiveCaseButton: {
        selector: "[data-test='archiveCaseButton']"
      },
      archiveCaseButtonInDialog: {
        selector: "[data-test='confirmArchiveCase']"
      },
      restoreCaseButton: {
        selector: "[data-test='restoreCaseButton']"
      },
      restoreCaseButtonInDialog: {
        selector: "[data-test='confirmRestoreArchivedCase']"
      },
      backToAllCasesButton: {
        selector: "[data-test='all-cases-link']"
      }
    },
    attachmentElements,
    officerElements,
    civilianElements,
    incidentElements
  )
};
