const e2e = require("./e2eUtilities.js");

const snackbarCommands = {
  presentWithRegex: function (regexexpression) {
    this.waitForElementVisible("@snackbarText", e2e.rerenderWait);
    const text = this.getText("@snackbarText");
    const regex = new RegExp(regexexpression, "i");
    return this.assert.equal(true, regex.test(regexexpression, text));
  },
  presentWithMessage: function (message) {
    return this.waitForElementVisible("@snackbarText", e2e.rerenderWait)
      .moveToElement("@snackbarText", 5, 5)
      .assert.containsText("@snackbarText", message);
  },
  close: function () {
    return this.click("@closeButton", e2e.logOnClick).waitForElementNotPresent(
      "@snackbarText",
      e2e.rerenderWait
    );
  }
};

module.exports = {
  commands: [snackbarCommands],
  elements: {
    snackbarText: {
      selector: '[data-testid="sharedSnackbarBannerText"]'
    },
    closeButton: {
      selector: '[data-testid="closeSnackbar"]'
    }
  }
};
