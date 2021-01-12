const e2e = require("./e2eUtilities.js");

const EditOfficerSearchCommands = {
  isOnPage: function() {
    this.waitForElementVisible(
      "@pageTitle",
      e2e.rerenderWait
    ).assert.containsText("@pageTitle", "Edit Officer");
    this.assert.containsText("@pageHeader", "Search for an Officer");
    return this;
  },
  setLastName: function(lastName) {
    return this.setValue("@lastNameField", lastName);
  },
  searchForOfficer: function() {
    return this.waitForElementVisible(
      "@submitSearchButton",
      e2e.rerenderWait
    ).click("@submitSearchButton", e2e.logOnClick);
  },
  selectNewOfficer: function() {
    return this.waitForElementVisible(
      "@selectNewOfficerButton",
      e2e.roundtripWait
    ).click("@selectNewOfficerButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [EditOfficerSearchCommands],
  elements: {
    pageTitle: {
      selector: "[data-testid='officer-search-title']"
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
    selectNewOfficerButton: {
      selector: '[data-testid="selectNewOfficerButton"]'
    }
  }
};
