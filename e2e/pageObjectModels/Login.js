const e2e = require("../e2eUtilities.js");

const loginCommands = {
  loginAs: function(user, password) {
    return this.waitForElementVisible("@email", e2e.rerenderWait)
      .setValue("@email", user)
      .setValue("@password", password)
      .click("@submitButton");
  },
  isOnPage: function() {
    return this.waitForElementVisible("body", e2e.rerenderWait).assert.title(
      "Sign In with Auth0"
    );
  }
};

module.exports = {
  commands: [loginCommands],
  elements: {
    email: {
      selector: "[name=email]"
    },
    password: {
      selector: "[name=password]"
    },
    submitButton: {
      selector: "button[type=submit]"
    }
  }
};
