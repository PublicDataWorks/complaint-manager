const e2e = require("./e2eUtilities.js");

const AddCivilainWithinNopdCommands = {
  isOnPage: function() {
    return this.waitForElementVisible(
      "@submitCivilianWithinNopdButton",
      e2e.rerenderWait
    );
  },
  selectRole: function(role) {
    return this.waitForElementVisible("@roleDropdown", e2e.rerenderWait)
      .click("@roleDropdown")
      .waitForElementVisible("@roleMenu", e2e.rerenderWait)
      .click(`li[data-value=${role}`)
      .waitForElementNotPresent("@roleMenu", e2e.rerenderWait);
  },
  submitCivilianWithinNopd: function() {
    this.waitForElementVisible(
      "@submitCivilianWithinNopdButton",
      e2e.rerenderWait
    ).click("@submitCivilianWithinNopdButton");
  }
};

module.exports = {
  commands: [AddCivilainWithinNopdCommands],
  elements: {
    roleDropdown: {
      selector: '[data-test="roleOnCaseDropdown"] > div > div > div'
    },
    roleMenu: {
      selector: '[id="roleOnCase"]'
    },
    submitCivilianWithinNopdButton: {
      selector: '[data-test="officerSubmitButton"]'
    }
  }
};
