const e2e = require("./e2eUtilities.js");

const AllegationsCommands = {
  isOnPage: function() {
    this.waitForElementVisible(
      "@pageTitle",
      e2e.rerenderWait
    ).assert.containsText("@pageTitle", "Manage Allegations");
    return this;
  },
  setRule: function() {
    this.waitForElementVisible("@ruleDropdown", e2e.rerenderWait)
      .click("@ruleDropdown")
      .waitForElementVisible("@menu", e2e.rerenderWait)
      .api.pause(e2e.dataLoadWait);
    return this.click("@lastRule").waitForElementNotPresent(
      "menu",
      e2e.rerenderWait
    );
  },
  searchForAllegations: function() {
    this.waitForElementVisible(
      "@allegationSearchSubmitButton",
      e2e.rerenderWait
    ).api.pause(e2e.pause);
    return this.click("@allegationSearchSubmitButton");
  },
  selectAllegation: function() {
    this.waitForElementVisible(
      "@selectAllegationButton",
      e2e.rerenderWait
    ).api.pause(e2e.dataLoadWait);
    return this.click("@selectAllegationButton");
  },
  setAllegationDetails: function(details) {
    return this.setValue("@allegationDetails", details);
  },
  setAllegationSeverity: function() {
    this.waitForElementVisible("@allegationSeverityDropdown", e2e.rerenderWait)
      .click("@allegationSeverityDropdown")
      .waitForElementVisible("@menu", e2e.rerenderWait)
      .api.pause(e2e.dataLoadWait);
    return this.click("@firstAllegationSeverityOption");
  },
  addAllegation: function() {
    return this.waitForElementVisible(
      "@addAllegationButton",
      e2e.rerenderWait
    ).click("@addAllegationButton");
  },
  newAllegationExists: function() {
    return this.waitForElementVisible("@newAllegation", e2e.rerenderWait);
  },
  returnToCase: function() {
    return this.waitForElementVisible(
      "@backToCaseButton",
      e2e.rerenderWait
    ).click("@backToCaseButton");
  }
};

module.exports = {
  commands: [AllegationsCommands],
  elements: {
    pageTitle: {
      selector: '[data-test="pageTitle"]'
    },
    ruleDropdown: {
      selector: '[data-test="ruleInput"]+div>button'
    },
    menu: {
      selector: ".MuiAutocomplete-popper"
    },
    lastRule: {
      selector: "li:last-child"
    },
    allegationSearchSubmitButton: {
      selector: '[data-test="allegationSearchSubmitButton"]'
    },
    selectAllegationButton: {
      selector: '[data-test="selectAllegationButton"]'
    },
    allegationDetails: {
      selector: '[data-test="allegationDetailsInput"]'
    },
    allegationSeverityDropdown: {
      selector: '[data-test="allegationSeverityInput"]+div>button'
    },
    firstAllegationSeverityOption: { selector: "li", index: 1 },
    addAllegationButton: {
      selector: '[data-test="addAllegationButton"]'
    },
    newAllegation: {
      selector: '[data-test="officerAllegation0"]'
    },
    backToCaseButton: {
      selector: '[data-test="back-to-case-link"]'
    }
  }
};
