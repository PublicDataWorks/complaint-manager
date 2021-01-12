const e2e = require("./e2eUtilities.js");

const loginCommands = {
  loginAs: function(user, password) {
    return this.waitForElementVisible("@email", e2e.rerenderWait)
      .setValue("@email", user)
      .setValue("@password", password)
      .click("@submitButton", e2e.logOnClick);
  },
  isOnPage: function() {
    return this.waitForElementVisible(
      "@loginWidget",
      e2e.rerenderWait
    ).assert.title("Sign In with Auth0");
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
    },
    loginWidget: {
      selector: "div.auth0-lock-widget-container"
    }
  }
};
