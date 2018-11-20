const e2e = require("../../e2eUtilities.js");

const officerCommands = {
  thereIsAnUnknownOfficer: function() {
    this.waitForElementVisible(
      "@unknownOfficerPanel",
      e2e.roundtripWait
    ).assert.containsText("@unknownOfficerPanel", "Unknown Officer");
    return this;
  },
  clickManageOfficer: function() {
    return this.waitForElementVisible(
      "@manageOfficerButton",
      e2e.rerenderWait
    ).click("@manageOfficerButton");
  },
  clickEditOfficer: function() {
    return this.waitForElementVisible(
      "@editOfficerButton",
      e2e.rerenderWait
    ).click("@editOfficerButton");
  },
  thereIsAKnownOfficer: function(officerName) {
    this.waitForElementVisible(
      "@knownOfficerPanel",
      e2e.roundtripWait
    ).assert.containsText("@knownOfficerPanel", officerName);
    return this;
  },
  clickManageAllegations: function() {
    return this.waitForElementVisible(
      "@manageAllegationsButton",
      e2e.rerenderWait
    ).click("@manageAllegationsButton");
  }
};

const officerElements = {
  editComplainantLink: {
    selector: "[data-test='editComplainantLink']"
  },
  unknownOfficerPanel: {
    selector: "[data-test='unknownOfficerPanel']"
  },
  manageOfficerButton: {
    selector: "[data-test='manageCaseOfficer']"
  },
  manageAllegationsButton: {
    selector: '[data-test="addAllegation"]'
  },
  editOfficerButton: {
    selector: "[data-test='editCaseOfficer']"
  },
  knownOfficerPanel: {
    selector: '[data-test="officerPanel"]'
  }
};

module.exports = { officerCommands, officerElements };
