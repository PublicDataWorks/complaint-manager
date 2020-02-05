const e2e = require("./e2eUtilities.js");

const matrixDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@matrixDialog", e2e.rerenderWait);
  },
  fillsInFirstReviewer: function() {
    return this.waitForElementPresent(
      "@firstReviewerDropdown",
      e2e.rerenderWait
    )
      .click("@firstReviewerDropdown")
      .waitForElementPresent("@menu", e2e.rerenderWait)
      .moveToElement("@selectFirstReviewer", 20, 20)
      .click("@selectFirstReviewer")
      .waitForElementNotPresent("@menu", e2e.rerenderWait);
  },
  fillsInSecondReviewer: function() {
    return this.waitForElementPresent(
      "@secondReviewerDropdown",
      e2e.rerenderWait
    )
      .click("@secondReviewerDropdown")
      .waitForElementPresent("@menu", e2e.rerenderWait)
      .moveToElement("@selectSecondReviewer", 20, 20)
      .click("@selectSecondReviewer")
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
      selector: "[data-testid='create-matrix-dialog-title']"
    },

    firstReviewerDropdown: {
      selector: "[data-testid='firstReviewerInput'] + div > button"
    },

    secondReviewerDropdown: {
      selector: "[data-testid='secondReviewerInput'] + div > button"
    },

    menu: { selector: ".MuiAutocomplete-popper" },

    pibControlNumber: { selector: "[data-testid='pib-control-input']" },

    createMatrixButton: { selector: "[data-testid='create-and-search']" },

    selectFirstReviewer: {
      selector: '[data-option-index="0"]'
    },

    selectSecondReviewer: {
      selector: '[data-option-index="1"]'
    }
  }
};
