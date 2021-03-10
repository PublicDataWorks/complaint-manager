const e2e = require("./e2eUtilities.js");

const addCivilianWithinPdCommands = {
  isOnPage: function(browser) {
    this.waitForElementPresent(
      "@pageTitle",
      e2e.rerenderWait
    ).assert.containsText("@pageTitle", browser.globals.add_civilian);
    this.assert.containsText("@pageHeader", browser.globals.search_civilian);
    return this;
  },
  setLastName: function(lastName) {
    return this.setValue("@lastNameField", lastName);
  },
  searchForCivilianWithinPd: function() {
    return this.waitForElementVisible(
      "@submitSearchButton",
      e2e.rerenderWait
    ).click("@submitSearchButton", e2e.logOnClick);
  },
  selectNewCivilianWithinPd: function() {
    return this.waitForElementVisible(
      "@selectNewCivilianWithinPdButton",
      e2e.roundtripWait
    ).click("@selectNewCivilianWithinPdButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [addCivilianWithinPdCommands],
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
    selectNewCivilianWithinPdButton: {
      selector: '[data-testid="selectNewOfficerButton"]'
    }
  }
};
