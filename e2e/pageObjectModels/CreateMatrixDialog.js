const e2e = require("./e2eUtilities.js");

const matrixDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@matrixDialog", e2e.rerenderWait);
  },
  fillsInFirstReviewer: function(reviewerName) {
    return this.waitForElementVisible(
      "@firstReviewerDropdown",
      e2e.rerenderWait
    )
      .click("@firstReviewerDropdown")
      .waitForElementVisible("@menu", e2e.rerenderWait)
      .click(`li[data-value="${reviewerName}"]`)
      .waitForElementNotPresent("@menu", e2e.rerenderWait);
  },
  fillsInSecondReviewer: function(reviewerName) {
    return this.waitForElementVisible(
      "@secondReviewerDropdown",
      e2e.rerenderWait
    )
      .click("@secondReviewerDropdown")
      .waitForElementVisible("@menu", e2e.rerenderWait)
      .click(`li[data-value="${reviewerName}"]`)
      .waitForElementNotPresent("@menu", e2e.rerenderWait);
  },
  fillsInPIBControlNumber: function(pibControlNumber) {
    return this.waitForElementVisible(
      "@pibControlNumber",
      e2e.rerenderWait
    ).setValue("@pibControlNumber", [pibControlNumber]);
  },
  clicksCreateButton: function() {
    return this.waitForElementVisible(
      "@createMatrixButton",
      e2e.roundtripWait
    ).click("@createMatrixButton");
  }
};

module.exports = {
  commands: [matrixDialogCommands],
  elements: {
    matrixDialog: {
      selector: "[data-test='create-matrix-dialog-title']"
    },
    firstReviewerDropdown: {
      selector: "[data-test='first-reviewer-dropdown']"
    },
    secondReviewerDropdown: {
      selector: "[data-test='second-reviewer-dropdown']"
    },
    usersList: { selector: "[role='listbox']" },
    menu: { selector: "[data-test='menu-paper']" },
    pibControlNumber: { selector: "[data-test='pib-control-input']" },
    createMatrixButton: { selector: "[data-test='create-and-search']" }
  }
};
