const e2e = require("../../e2eUtilities.js");

const incidentCommands = {
  openIncidentDetails: function() {
    return this.waitForElementVisible(
      "@editIncidentDetailsButton",
      e2e.rerenderWait
    ).click("@editIncidentDetailsButton");
  },
  incidentAddressIsSpecified: function() {
    this.waitForElementPresent("@incidentAddress", e2e.rerenderWait)
      .expect.element("@incidentAddress")
      .text.to.not.equal("No address specified");
    this.expect.element("@incidentAddress").text.to.not.equal("");
    return this;
  }
};

const incidentElements = {
  editIncidentDetailsButton: {
    selector: '[data-test="editIncidentDetailsButton"]'
  },
  incidentAddress: {
    selector: '[data-test="incidentLocation"]'
  }
};

module.exports = { incidentCommands, incidentElements };
