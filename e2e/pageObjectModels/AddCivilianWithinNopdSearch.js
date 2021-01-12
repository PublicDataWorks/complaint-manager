const e2e = require("./e2eUtilities.js");

const addCivilianWithinNopdCommands = {
  isOnPage: function() {
    this.waitForElementPresent(
      "@pageTitle",
      e2e.rerenderWait
    ).assert.containsText("@pageTitle", "Add Civilian (NOPD)");
    this.assert.containsText("@pageHeader", "Search for a Civilian (NOPD)");
    return this;
  },
  setLastName: function(lastName) {
    return this.setValue("@lastNameField", lastName);
  },
  searchForCivilianWithinNopd: function() {
    return this.waitForElementVisible(
      "@submitSearchButton",
      e2e.rerenderWait
    ).click("@submitSearchButton", e2e.logOnClick);
  },
  selectNewCivilianWithinNopd: function() {
    return this.waitForElementVisible(
      "@selectNewCivilianWithinNopdButton",
      e2e.roundtripWait
    ).click("@selectNewCivilianWithinNopdButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [addCivilianWithinNopdCommands],
  elements: {
    pageTitle: {
      selector: '[data-testid="officer-search-title"]'
    },
    pageHeader: {
      selector: "[data-testid='search-page-header']"
    },
    lastNameField: {
      selector: '[data-testid="lastNameField"]'
    },
    submitSearchButton: {
      selector: '[data-testid="officerSearchSubmitButton"]'
    },
    selectNewCivilianWithinNopdButton: {
      selector: '[data-testid="selectNewOfficerButton"]'
    }
  }
};
