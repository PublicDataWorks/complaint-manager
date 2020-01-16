const e2e = require("./e2eUtilities.js");

const matrixDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@matrixDialog", e2e.rerenderWait);
  },
  fillsInFirstReviewer: function(reviewerNameId) {
    return this.waitForElementPresent(
      "@firstReviewerDropdown",
      e2e.rerenderWait
    )
      .click("@firstReviewerDropdown")
      .waitForElementPresent("@menu", e2e.rerenderWait)
      .click({ selector: "@toSelect", index: reviewerNameId })
      .waitForElementNotPresent("@menu", e2e.rerenderWait);
  },
  fillsInSecondReviewer: function(reviewerNameId) {
    return this.waitForElementPresent(
      "@secondReviewerDropdown",
      e2e.rerenderWait
    )
      .click("@secondReviewerDropdown")
      .waitForElementPresent("@menu", e2e.rerenderWait)
      .click({ selector: "@toSelect", index: reviewerNameId })
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
      selector: "[data-test='firstReviewerInput'] + div > button"
    },

    secondReviewerDropdown: {
      selector: "[data-test='secondReviewerInput'] + div > button"
    },

    menu: { selector: ".MuiAutocomplete-popper" },

    pibControlNumber: { selector: "[data-test='pib-control-input']" },

    createMatrixButton: { selector: "[data-test='create-and-search']" },

    toSelect: {
      selector: "li"
    }
  }
};
