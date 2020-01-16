const e2e = require("./e2eUtilities.js");

const snackbarCommands = {
  presentWithRegex: function(regexexpression) {
    this.waitForElementVisible("@snackbarText", e2e.rerenderWait);
    const text = this.getText("@snackbarText");
    const regex = new RegExp(regexexpression, "i");
    return this.assert.equal(true, regex.test(regexexpression, text));
  },
  presentWithMessage: function(message) {
    return this.waitForElementVisible(
      "@snackbarText",
      e2e.rerenderWait
    ).assert.containsText("@snackbarText", message);
  },
  close: function() {
    return this.click("@closeButton").waitForElementNotPresent(
      "@snackbarText",
      e2e.rerenderWait
    );
  }
};

module.exports = {
  commands: [snackbarCommands],
  elements: {
    snackbarText: {
      selector: '[data-test="sharedSnackbarBannerText"]'
    },
    closeButton: {
      selector: '[data-test="closeSnackbar"]'
    }
  }
};
