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
    return this.click("@raceEthnicityDropdown")
      .waitForElementVisible("@raceEthnicityMenu", e2e.rerenderWait)
      .api.pause(e2e.pause)
      .click(`li[data-value=${raceEthnicity}`)
      .waitForElementNotPresent("@raceEthnicityMenu", e2e.rerenderWait);
  },
  typeInAddress: function(addressInput) {
    return this.setValue("@addressField", [addressInput]);
  },
  thereAreSuggestions: function() {
    return this.waitForElementPresent("@suggestionContainer", e2e.rerenderWait)
      .api.pause(e2e.pause)
      .getValue("@addressField", result => {
        this.assert.ok(result.value.length > 4);
      });
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
    addressField: {
      selector: '[data-test="addressSuggestionField"] > input'
    },
    suggestionContainer: {
      selector: '[data-test="suggestion-container"] > ul'
    }
  }
};
