const e2e = require("./e2eUtilities.js");

const AllegationsCommands = {
  isOnPage: function () {
    this.waitForElementVisible(
      "@pageTitle",
      e2e.rerenderWait
    ).assert.containsText("@pageTitle", "Manage Allegations");
    return this;
  },
  setRule: function () {
    this.waitForElementVisible("@ruleDropdown", e2e.rerenderWait)
      .click("@ruleDropdown", e2e.logOnClick)
      .waitForElementVisible("@menu", e2e.rerenderWait)
      .api.pause(e2e.dataLoadWait);
    return this.click("@lastRule", e2e.logOnClick).waitForElementNotPresent(
      "menu",
      e2e.rerenderWait
    );
  },
  searchForAllegations: function () {
    this.waitForElementVisible(
      "@allegationSearchSubmitButton",
      e2e.rerenderWait
    ).api.pause(e2e.pause);
    return this.click("@allegationSearchSubmitButton", e2e.logOnClick);
  },
  selectAllegation: function () {
    this.waitForElementVisible(
      "@selectAllegationButton",
      e2e.rerenderWait
    ).api.pause(e2e.dataLoadWait);
    return this.click("@selectAllegationButton", e2e.logOnClick);
  },
  setAllegationDetails: function (details) {
    return this.setValue("@allegationDetails", details);
  },
  setAllegationSeverity: function () {
    this.waitForElementVisible("@allegationSeverityDropdown", e2e.rerenderWait)
      .click("@allegationSeverityDropdown", e2e.logOnClick)
      .waitForElementVisible("@menu", e2e.rerenderWait)
      .api.pause(e2e.dataLoadWait);
    return this.click("@firstAllegationSeverityOption", e2e.logOnClick);
  },
  addAllegation: function () {
    return this.waitForElementVisible(
      "@addAllegationButton",
      e2e.rerenderWait
    ).click("@addAllegationButton", e2e.logOnClick);
  },
  newAllegationExists: function () {
    return this.waitForElementVisible("@newAllegation", e2e.rerenderWait);
  },
  returnToCase: function () {
    return this.waitForElementVisible(
      "@backToCaseButton",
      e2e.rerenderWait
    ).click("@backToCaseButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [AllegationsCommands],
  elements: {
    pageTitle: {
      selector: '[data-testid="pageTitle"]'
    },
    ruleDropdown: {
      selector: '[data-testid="ruleInput"]+div>button'
    },
    menu: {
      selector: ".MuiAutocomplete-popper"
    },
    lastRule: {
      selector: "li:last-child"
    },
    allegationSearchSubmitButton: {
      selector: '[data-testid="allegationSearchSubmitButton"]'
    },
    selectAllegationButton: {
      selector: '[data-testid="selectAllegationButton"]'
    },
    allegationDetails: {
      selector: '[data-testid="allegationDetailsInput"]'
    },
    allegationSeverityDropdown: {
      selector: '[data-testid="allegationSeverityInput"]+div>button'
    },
    firstAllegationSeverityOption: { selector: "li", index: 1 },
    addAllegationButton: {
      selector: '[data-testid="addAllegationButton"]'
    },
    newAllegation: {
      selector: '[data-testid="officerAllegation0"]'
    },
    backToCaseButton: {
      selector: '[data-testid="back-to-case-link"]'
    }
  }
};
