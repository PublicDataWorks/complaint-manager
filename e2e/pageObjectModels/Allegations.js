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
      .waitForElementVisible("@ruleList", e2e.rerenderWait)
      .api.pause(e2e.dataLoadWait);
    return this.click("@lastRule");
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
      .waitForElementVisible("@allegationSeverityMenu", e2e.rerenderWait)
      .click("@lastAllegationSeverityOption")
      .api.pause(e2e.pause);
    return this;
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
      selector: '[data-test="ruleDropdown"]'
    },
    ruleList: {
      selector: '[role="listbox"]'
    },
    lastRule: {
      selector: '[role="listbox"] > li:last-child'
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
      selector: '[data-test="allegationSeverityField"]'
    },
    allegationSeverityMenu: {
      selector: '[role="listbox"]'
    },
    lastAllegationSeverityOption: {
      selector: '[role="listbox"] > li:last-child'
    },
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
