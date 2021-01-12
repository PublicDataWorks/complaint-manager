const e2e = require("../e2eUtilities.js");

const incidentCommands = {
  openIncidentDetails: function () {
    return this.waitForElementVisible(
      "@editIncidentDetailsButton",
      e2e.rerenderWait
    ).click("@editIncidentDetailsButton", e2e.logOnClick);
  },
  incidentAddressIsSpecified: function () {
    this.waitForElementPresent("@incidentAddress", e2e.rerenderWait)
      .expect.element("@incidentAddress")
      .text.to.not.equal("No address specified");
    this.expect.element("@incidentAddress").text.to.not.equal("");
    return this;
  },
  setNarrativeSummary: function () {
    return this.waitForElementVisible(
      "@narrativeSummary",
      e2e.rerenderWait
    ).setValue("@narrativeSummary", "test summary data");
  },
  setNarrativeDetails: function () {
    return this.waitForElementVisible(
      "@narrativeDetails",
      e2e.rerenderWait
    ).setValue("@narrativeDetails", "test details data");
  },
  saveNarrative: function () {
    return this.waitForElementVisible(
      "@narrativePromptDetails",
      e2e.rerenderWait
    ).click("@narrativePromptDetails", e2e.logOnClick);
  }
};

const incidentElements = {
  editIncidentDetailsButton: {
    selector: '[data-testid="editIncidentDetailsButton"]'
  },
  incidentAddress: {
    selector: '[data-testid="incidentLocation"]'
  },
  narrativeSummary: {
    selector: '[data-testid="narrativeSummaryInput"]'
  },
  narrativeDetails: {
    selector: '[class="ql-editor ql-blank"]'
  },
  narrativePromptDetails: {
    selector: '[data-testid="narrativePromptDetails"]'
  }
};

module.exports = { incidentCommands, incidentElements };
