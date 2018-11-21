const e2e = require("../../e2eUtilities.js");

const civilianCommands = {
  civilianAddressIsSpecified: function() {
    this.waitForElementPresent("@civilianAddress", e2e.rerenderWait)
      .expect.element("@civilianAddress")
      .text.to.not.equal("No address specified");
    return this;
  },
  editComplainant: function() {
    return this.waitForElementVisible(
      "@editComplainantButton",
      e2e.rerenderWait
    ).click("@editComplainantButton");
  }
};

const civilianElements = {
  civilianAddress: {
    selector: '[data-test="civilianAddress"]'
  },
  editComplainantButton: {
    selector: "[data-test=editComplainantLink]"
  }
};

module.exports = { civilianCommands, civilianElements };
