const e2e = require("./e2eUtilities.js");

const iaproAllegationsCommands = {
  isOnPage: function() {
    return this.waitForElementPresent(
      "@pageHeader",
      e2e.rerenderWait
    ).assert.containsText("@pageHeader", "IAPro Corrections");
  },
  setNthDetails: function(n, details) {
    return this.waitForElementVisible(
      `[name="referralLetterIaproCorrections[${n}].details"]`,
      e2e.rerenderWait
    )
      .click(`[name="referralLetterIaproCorrections[${n}].details"]`)
      .setValue(
        `[name="referralLetterIaproCorrections[${n}].details"]`,
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
      `[data-testid="referralLetterIaproCorrections[${n}]-open-remove-dialog-button"]`
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
      .element(`[name="referralLetterIaproCorrections[${n}].details"]`)
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
      selector: '[data-testid="iapro-corrections-page-header"]'
    },
    removeCorrectionDialogButton: {
      selector: '[data-testid="remove-iapro-correction-button"]'
    },
    nextButton: {
      selector: "[data-testid='next-button']"
    },
    newCorrectionButton: {
      selector: "[data-testid='addIAProCorrectionButton']"
    }
  }
};
