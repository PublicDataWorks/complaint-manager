const e2e = require("../e2eUtilities.js");

const iaproAllegationsCommands = {
  isOnPage: function() {
    return this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "IAPro Corrections");
  },
  setNthDetails: function(n, details) {
    return this.setValue(
      `[name="referralLetterIAProCorrections[${n}].details"]`,
      details
    );
  },
  clickNext: function() {
    this.api.pause(e2e.pause);
    return this.waitForElementPresent("@nextButton", e2e.rerenderWait).click(
      "@nextButton"
    );
  },
  removeNthCorrection: function(n) {
    return this.click(
      `[data-test="referralLetterIAProCorrections[${n}]-open-remove-dialog-button"]`
    )
      .waitForElementPresent("@removeCorrectionDialogButton", e2e.rerenderWait)
      .click("@removeCorrectionDialogButton")
      .waitForElementNotPresent(
        "@removeCorrectionDialogButton",
        e2e.rerenderWait
      );
  },
  expectNthCorrectionValue: function(n, expectedValue) {
    this.expect
      .element(`[name="referralLetterIAProCorrections[${n}].details"]`)
      .text.to.equal(expectedValue);
    return this;
  },
  addCorrection: function() {
    return this.click("@newCorrectionButton");
  }
};

module.exports = {
  commands: [iaproAllegationsCommands],
  elements: {
    pageHeader: {
      selector: '[data-test="iapro-corrections-page-header"]'
    },
    removeCorrectionDialogButton: {
      selector: '[data-test="remove-iapro-correction-button"]'
    },
    nextButton: {
      selector: "[data-test='next-button']"
    },
    newCorrectionButton: {
      selector: "[data-test='addIAProCorrectionButton']"
    }
  }
};
