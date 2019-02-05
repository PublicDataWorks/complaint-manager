const e2e = require("../e2eUtilities.js");

const civilianDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  setGenderIdentity: function(gender) {
    return this.click("@genderDropdown")
      .waitForElementVisible("@genderMenu", e2e.rerenderWait)
      .click(`li[data-value=${gender}]`)
      .waitForElementNotPresent("@genderMenu", e2e.rerenderWait);
  },
  setRaceEthnicityId: function(raceEthnicity) {
    this.click("@raceEthnicityDropdown")
      .waitForElementVisible("@raceEthnicityMenu", e2e.roundtripWait)
      .waitForElementVisible("@menuOption", e2e.roundtripWait)
      .api.pause(e2e.animationPause);
    return this.click(
      `li[data-value="${raceEthnicity}"]`
    ).waitForElementNotPresent("@raceEthnicityMenu", e2e.rerenderWait);
  },
  setTitle: function(title) {
    return this.click("@titleDropdown")
      .waitForElementVisible("@titleMenu", e2e.rerenderWait)
      .waitForElementVisible("@menuOption", e2e.roundtripWait)
      .click(`li[data-value=${title}]`)
      .waitForElementNotPresent("@titleMenu", e2e.rerenderWait);
  },
  typeInAddress: function(addressInput) {
    return this.setValue("@addressSuggestionField", [addressInput]);
  },
  setAddressSuggestionFieldToEmpty: function() {
    this.click("@addressSuggestionField").api.keys(
      Array(50)
        .fill(this.api.Keys.BACK_SPACE)
        .concat(Array(50).fill(this.api.Keys.DELETE))
    );
    return this;
  },
  thereAreSuggestions: function() {
    this.waitForElementPresent(
      '[data-test="suggestion-container"] > ul',
      e2e.rerenderWait
    ).api.pause(e2e.dataLoadWait);
    return this;
  },
  arrowDown: function() {
    return this.setValue("@addressSuggestionField", [this.api.Keys.ARROW_DOWN]);
  },
  addressSuggestionFieldPopulated: function() {
    return this.getValue("@addressSuggestionField", result => {
      this.assert.ok(result.value.length > 4);
    });
  },
  addressFieldsAreEmpty: function() {
    this.expect.element("@streetAddressInput").value.to.equal("");
    this.expect.element("@cityInput").value.to.equal("");
    this.expect.element("@stateInput").value.to.equal("");
    this.expect.element("@zipCodeInput").value.to.equal("");
    this.expect.element("@countryInput").value.to.equal("");
    return this;
  },
  selectSuggestion: function() {
    this.setValue("@addressSuggestionField", [this.api.Keys.ENTER]).api.pause(
      e2e.pause
    );
    return this;
  },
  addressFieldsAreNotEmpty: function() {
    this.expect.element("@streetAddressInput").value.to.not.equal("");
    this.expect.element("@cityInput").value.to.not.equal("");
    this.expect.element("@stateInput").value.to.not.equal("");
    this.expect.element("@zipCodeInput").value.to.not.equal("");
    this.expect.element("@countryInput").value.to.not.equal("");
    return this;
  },
  submitCivilianDialog: function() {
    return this.click("@submitEditCivilianButton");
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
      selector: '[id="menu-raceEthnicityId"]'
    },
    titleDropdown: {
      selector: "[data-test='titleDropdown'] > div > div > div"
    },
    titleMenu: {
      selector: "[id='menu-title']"
    },
    addressSuggestionField: {
      selector: '[data-test="addressSuggestionField"] > input'
    },
    suggestionContainer: {
      selector: '[data-test="suggestion-container"] > ul'
    },
    streetAddressInput: {
      selector: '[data-test="streetAddressInput"]'
    },
    cityInput: {
      selector: '[data-test="cityInput"]'
    },
    stateInput: {
      selector: '[data-test="stateInput"]'
    },
    zipCodeInput: {
      selector: '[data-test="zipCodeInput"]'
    },
    countryInput: {
      selector: '[data-test="countryInput"]'
    },
    submitEditCivilianButton: {
      selector: 'button[data-test="submitEditCivilian"]'
    },
    menuOption: {
      selector: "[role='option']"
    }
  }
};
