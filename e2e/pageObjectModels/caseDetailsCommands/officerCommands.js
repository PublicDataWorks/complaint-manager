const e2e = require("../e2eUtilities.js");

const officerCommands = {
  thereIsAnUnknownOfficer: function() {
    this.waitForElementVisible(
      "@unknownOfficerPanel",
      e2e.roundtripWait
    ).assert.containsText("@unknownOfficerPanel", "Unknown Officer");
    return this;
  },
  clickManageUnknownOfficer: function() {
    return this.waitForElementVisible(
      "@manageUnknownOfficerButton",
      e2e.rerenderWait
    ).click("@manageUnknownOfficerButton");
  },
  clickManageKnownOfficer: function() {
    return this.waitForElementVisible(
      "@manageKnownOfficerButton",
      e2e.rerenderWait
    ).click("@manageKnownOfficerButton");
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
  thereIsNoUnknownOfficer: function() {
    return this.waitForElementNotPresent(
      "@unknownOfficerPanel",
      e2e.rerenderWait
    );
  },
  clickManageAllegations: function() {
    return this.waitForElementVisible(
      "@manageAllegationsButton",
      e2e.rerenderWait
    ).click("@manageAllegationsButton");
  },
  addWitnessCivilianWithinNopd: function() {
    this.waitForElementVisible("@addWitnessMenu", e2e.rerenderWait).click(
      "@addWitnessMenu"
    );
    return this.waitForElementVisible(
      "@addWitnessCivilianWithinNopd",
      e2e.rerenderWait
    ).click("@addWitnessCivilianWithinNopd");
  },
  thereIsAKnownCivilianWithinNopd: function(civilianWithinNopdName) {
    this.waitForElementVisible(
      "@knownCivilianWithinNopdPanel",
      e2e.roundtripWait
    ).assert.containsText(
      "@knownCivilianWithinNopdPanel",
      civilianWithinNopdName
    );
    return this;
  },
  addAccusedOfficer: function() {
    this.waitForElementVisible("@addAccusedMenu", e2e.rerenderWait).click(
      "@addAccusedMenu"
    );
    return this.waitForElementVisible(
      "@addAccusedOfficer",
      e2e.rerenderWait
    ).click("@addAccusedOfficer");
  },
  clickRemoveOfficer: function() {
    return this.waitForElementVisible(
      "@removeOfficerButton",
      e2e.rerenderWait
    ).click("@removeOfficerButton");
  },
  confirmRemoveOfficerInDialog: function() {
    return this.waitForElementVisible(
      "@removeOfficerDialogButton",
      e2e.rerenderWait
    ).click("@removeOfficerDialogButton");
  }
};

const officerElements = {
  unknownOfficerPanel: {
    selector: "[data-test='unknownOfficerPanel']"
  },
  manageKnownOfficerButton: {
    selector: "[data-test='knownOfficerPanel'] [data-test='manageCaseOfficer']"
  },
  manageUnknownOfficerButton: {
    selector:
      "[data-test='unknownOfficerPanel'] [data-test='manageCaseOfficer']"
  },
  manageAllegationsButton: {
    selector: '[data-test="addAllegation"]'
  },
  editOfficerButton: {
    selector: "[data-test='editCaseOfficer']"
  },
  knownOfficerPanel: {
    selector: '[data-test="knownOfficerPanel"]'
  },
  addWitnessMenu: {
    selector: '[data-test="addComplainantWitness"]'
  },
  addWitnessCivilianWithinNopd: {
    selector: '[data-test="addCivilianWithinNopdComplainantWitness"]'
  },
  knownCivilianWithinNopdPanel: {
    selector: "[data-test='knownCivilian(NOPD)Panel']"
  },
  addAccusedMenu: {
    selector: '[data-test="addAccusedMenu"]'
  },
  addAccusedOfficer: {
    selector: '[data-test="addAccusedOfficer"]'
  },
  removeOfficerButton: {
    selector: '[data-test="removeCaseOfficer"]'
  },
  removeOfficerDialogButton: {
    selector: '[data-test="removeButton"]'
  }
};

module.exports = { officerCommands, officerElements };
