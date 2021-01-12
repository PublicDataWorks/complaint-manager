const e2e = require("./e2eUtilities.js");
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
  isOnPage: function () {
    return this.waitForElementVisible("@caseDetailsPage", e2e.roundtripWait);
  },

  beginLetter: function () {
    return this.waitForElementVisible("@updateStatusButton", e2e.rerenderWait)
      .assert.containsText("@updateStatusButton", "BEGIN LETTER")
      .click("@updateStatusButton", e2e.logOnClick);
  },
  confirmUpdateStatusInDialog: function () {
    return this.waitForElementVisible(
      "@updateStatusDialogButton",
      e2e.rerenderWait
    ).click("@updateStatusDialogButton", e2e.logOnClick);
  },
  clickReviewAndApproveButton: function () {
    return this.click("@reviewAndApproveButton", e2e.logOnClick);
  },
  closeCase: function () {
    return this.waitForElementVisible("@updateStatusButton", e2e.rerenderWait)
      .assert.containsText("@updateStatusButton", "MARK AS CLOSED")
      .click("@updateStatusButton", e2e.logOnClick);
  },
  archiveCase: function () {
    return this.waitForElementVisible(
      "@archiveCaseButton",
      e2e.rerenderWait
    ).click("@archiveCaseButton", e2e.logOnClick);
  },
  confirmArchiveInDialog: function () {
    return this.waitForElementVisible(
      "@archiveCaseButtonInDialog",
      e2e.rerenderWait
    ).click("@archiveCaseButtonInDialog", e2e.logOnClick);
  },
  restoreCase: function () {
    return this.waitForElementVisible(
      "@restoreCaseButton",
      e2e.rerenderWait
    ).click("@restoreCaseButton", e2e.logOnClick);
  },
  confirmRestoreInDialog: function () {
    return this.waitForElementVisible(
      "@restoreCaseButtonInDialog",
      e2e.rerenderWait
    ).click("@restoreCaseButtonInDialog", e2e.logOnClick);
  },
  goBackToAllCases: function () {
    return this.waitForElementNotPresent(
      "@restoreCaseButtonInDialog",
      e2e.rerenderWait
    ).click("@backToAllCasesButton", e2e.logOnClick);
  },
  returnToCaseDashboard: function () {
    this.click("@backToAllCasesButton", e2e.logOnClick);
  },
  clickAddTagButton: function () {
    return this.waitForElementVisible("@addTagButton", e2e.rerenderWait).click(
      "@addTagButton",
      e2e.logOnClick
    );
  },
  caseTagIsPresent: function (tagName) {
    return this.waitForElementVisible(
      "@caseTagChip",
      e2e.rerenderWait
    ).assert.containsText("@caseTagChip", tagName);
  },
  clickRemoveTagButton: function (tagName) {
    return this.waitForElementVisible(
      "@removeTagButton",
      e2e.rerenderWait
    ).click("@removeTagButton", e2e.logOnClick);
  },
  noCaseTagsArePresent: function () {
    return this.waitForElementVisible(
      "@caseTagsContainer",
      e2e.rerenderWait
    ).assert.containsText("@caseTagsContainer", "No tags have been added");
  },
  clickAddCaseNoteButton: function () {
    return this.waitForElementVisible(
      "@addCaseNoteButton",
      e2e.rerenderWait
    ).click("@addCaseNoteButton", e2e.logOnClick);
  },
  caseNoteIsPresent: function (caseNote) {
    return this.waitForElementVisible(
      "@caseNoteText",
      e2e.rerenderWait
    ).assert.containsText("@caseNoteText", caseNote);
  },
  caseReferenceIsAC: function () {
    return this.waitForElementVisible(
      "@caseReference",
      e2e.rerenderWait
    ).assert.containsText("@caseReference", "AC");
  },
  addCivilianComplainant: function () {
    this.click("@addCivilianComplainant", e2e.logOnClick);
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
        selector: '[data-testid="case-details-page"]'
      },
      updateStatusButton: {
        selector: "[data-testid='update-status-button']"
      },
      caseTagsContainer: {
        selector: "[data-testid='caseTagsContainer']"
      },
      addTagButton: {
        selector: "[data-testid='addTagButton']"
      },
      caseTagChip: {
        selector: "[data-testid='caseTagChip']"
      },
      removeTagButton: {
        selector: "div[role='button'][data-testid='caseTagChip'] > svg"
      },
      addCaseNoteButton: {
        selector: "[data-testid='addCaseNoteButton']"
      },
      caseNoteText: {
        selector: "[data-testid='notesText']"
      },
      reviewAndApproveButton: {
        selector: "[data-testid='review-and-approve-letter-button']"
      },
      updateStatusDialogButton: {
        selector: "[data-testid='update-case-status-button']"
      },
      archiveCaseButton: {
        selector: "[data-testid='archiveCaseButton']"
      },
      archiveCaseButtonInDialog: {
        selector: "[data-testid='confirmArchiveCase']"
      },
      restoreCaseButton: {
        selector: "[data-testid='restoreCaseButton']"
      },
      restoreCaseButtonInDialog: {
        selector: "[data-testid='confirmRestoreArchivedCase']"
      },
      backToAllCasesButton: {
        selector: "[data-testid='all-cases-link']"
      },
      caseReference: {
        selector: "[data-testid='caseReference']"
      },
      addCivilianComplainant: {
        selector: "[data-testid='addCivilianComplainantWitness']"
      }
    },
    attachmentElements,
    officerElements,
    civilianElements,
    incidentElements
  )
};
