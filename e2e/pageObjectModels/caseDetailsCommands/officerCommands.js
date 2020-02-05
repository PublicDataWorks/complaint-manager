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
    )
      .moveToElement("@manageAllegationsButton", undefined, undefined)
      .click("@manageAllegationsButton");
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
    selector: "[data-testid='unknownOfficerPanel']"
  },
  manageKnownOfficerButton: {
    selector:
      "[data-testid='knownOfficerPanel'] [data-testid='manageCaseOfficer']"
  },
  manageUnknownOfficerButton: {
    selector:
      "[data-testid='unknownOfficerPanel'] [data-testid='manageCaseOfficer']"
  },
  manageAllegationsButton: {
    selector: '[data-testid="addAllegation"]'
  },
  editOfficerButton: {
    selector: "[data-testid='editCaseOfficer']"
  },
  knownOfficerPanel: {
    selector: '[data-testid="knownOfficerPanel"]'
  },
  addWitnessMenu: {
    selector: '[data-testid="addComplainantWitness"]'
  },
  addWitnessCivilianWithinNopd: {
    selector: '[data-testid="addCivilianWithinNopdComplainantWitness"]'
  },
  knownCivilianWithinNopdPanel: {
    selector: "[data-testid='knownCivilian(NOPD)Panel']"
  },
  addAccusedMenu: {
    selector: '[data-testid="addAccusedMenu"]'
  },
  addAccusedOfficer: {
    selector: '[data-testid="addAccusedOfficer"]'
  },
  removeOfficerButton: {
    selector: '[data-testid="removeCaseOfficer"]'
  },
  removeOfficerDialogButton: {
    selector: '[data-testid="removeButton"]'
  }
};

module.exports = { officerCommands, officerElements };
