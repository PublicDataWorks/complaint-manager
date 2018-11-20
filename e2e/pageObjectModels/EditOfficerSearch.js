const e2e = require("../e2eUtilities.js");

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
    ).click("@submitSearchButton");
  },
  selectNewOfficer: function() {
    return this.waitForElementVisible(
      "@selectNewOfficerButton",
      e2e.roundtripWait
    ).click("@selectNewOfficerButton");
  }
};

module.exports = {
  commands: [EditOfficerSearchCommands],
  elements: {
    pageTitle: {
      selector: "[data-test='officer-search-title']"
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
    selectNewOfficerButton: {
      selector: '[data-test="selectNewOfficerButton"]'
    }
  }
};
