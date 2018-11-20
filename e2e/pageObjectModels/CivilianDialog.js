const e2e = require("../e2eUtilities.js");

const civilianDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  setGenderIdentity: function(gender) {
    return this.click("@genderDropdown")
      .waitForElementVisible("@genderMenu", e2e.rerenderWait)
      .click(`li[data-value=${gender}`)
      .waitForElementNotPresent("@genderMenu", e2e.rerenderWait);
  },
  setRaceEthnicity: function(raceEthnicity) {
    this.click("@raceEthnicityDropdown").api.pause(e2e.pause);
    return this.waitForElementPresent(
      '[id="menu-raceEthnicity"]',
      e2e.rerenderWait
    )
      .click(`li[data-value=${raceEthnicity}`)
      .waitForElementNotPresent('[id="menu-raceEthnicity"]', e2e.rerenderWait);
  },
  typeInAddress: function(addressInput) {
    return this.setValue("@addressSuggestionField", [addressInput]);
  },
  thereAreSuggestions: function() {
    this.waitForElementPresent(
      '[data-test="suggestion-container"] > ul',
      e2e.rerenderWait
    ).api.pause(e2e.pause);
    return this;
  }
};

module.exports = {
  commands: [civilianDialogCommands],
  elements: {
    dialogTitle: {
      selector: "[data-test='editDialogTitle']"
    },
    genderDropdown: {
      selector: "[data-test='genderDropdown'] > div > div > div"
    },
    genderMenu: {
      selector: "[id='menu-genderIdentity']"
    },
    raceEthnicityDropdown: {
      selector: "[data-test='raceDropdown'] > div > div > div"
    },
    raceEthnicityMenu: {
      selector: '[id="menu-raceEthnicity"]'
    },
    addressSuggestionField: {
      selector: '[data-test="addressSuggestionField"] > input'
    },
    suggestionContainer: {
      selector: '[data-test="suggestion-container"] > ul'
    }
  }
};
