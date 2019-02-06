const e2e = require("../e2eUtilities.js");

const civilianCommands = {
  civilianAddressIsSpecified: function() {
    this.waitForElementPresent("@civilianAddress", e2e.rerenderWait)
      .expect.element("@civilianAddress")
      .text.to.not.equal("No address specified");
    this.expect.element("@civilianAddress").text.to.not.equal("");
    return this;
  },
  civilianAddressIsNotSpecified: function() {
    this.waitForElementPresent(
      "@civilianAddress",
      e2e.rerenderWait
    ).assert.containsText("@civilianAddress", "No address specified");
    return this;
  },
  editComplainant: function() {
    return this.waitForElementVisible(
      "@editComplainantButton",
      e2e.rerenderWait
    ).click("@editComplainantButton");
  },
  expandCivilianDetails: function() {
    const api = this.api;

    this.getAttribute("@expansionPanel", "aria-expanded", expanded => {
      if (expanded.value === "false") {
        api
          .click('[data-test="complainantWitnessesPanel"] > div')
          .pause(e2e.pause);
      }
    });

    return this;
  }
};

const civilianElements = {
  civilianAddress: {
    selector: '[data-test="civilianAddress"]'
  },
  editComplainantButton: {
    selector: "[data-test=editComplainantLink]"
  },
  expansionPanel: {
    selector: '[data-test="complainantWitnessesPanel"] > div'
  }
};

module.exports = { civilianCommands, civilianElements };
