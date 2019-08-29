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
    ).click("@submitSearchButton");
  },
  selectNewCivilianWithinNopd: function() {
    return this.waitForElementVisible(
      "@selectNewCivilianWithinNopdButton",
      e2e.roundtripWait
    ).click("@selectNewCivilianWithinNopdButton");
  }
};

module.exports = {
  commands: [addCivilianWithinNopdCommands],
  elements: {
    pageTitle: {
      selector: '[data-test="officer-search-title"]'
    },
    pageHeader: {
      selector: "[data-test='search-page-header']"
    },
    lastNameField: {
      selector: '[data-test="lastNameField"]'
    },
    submitSearchButton: {
      selector: '[data-test="officerSearchSubmitButton"]'
    },
    selectNewCivilianWithinNopdButton: {
      selector: '[data-test="selectNewOfficerButton"]'
    }
  }
};
