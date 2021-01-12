const e2e = require("./e2eUtilities.js");

const civilianDialogCommands = {
  dialogIsOpen: function () {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  setGenderIdentity: function (genderId) {
    return this.waitForElementPresent("@genderDropdown", e2e.rerenderWait)
      .click("@genderDropdown", e2e.logOnClick)
      .waitForElementPresent("@menu", e2e.rerenderWait)
      .click({ selector: "@toSelect", index: genderId }, e2e.logOnClick)
      .waitForElementNotPresent("@menu", e2e.rerenderWait);
  },
  setRaceEthnicity: function (raceEthnicityId) {
    return this.waitForElementPresent(
      "@raceEthnicityDropdown",
      e2e.rerenderWait
    )
      .click("@raceEthnicityDropdown", e2e.logOnClick)
      .waitForElementPresent("@menu", e2e.rerenderWait)
      .click({ selector: "@toSelect", index: raceEthnicityId }, e2e.logOnClick)
      .waitForElementNotPresent("@menu", e2e.rerenderWait);
  },
  setTitle: function (titleId) {
    return this.waitForElementPresent("@titleDropdown", e2e.rerenderWait)
      .click("@titleDropdown", e2e.logOnClick)
      .waitForElementPresent("@menu", e2e.rerenderWait)
      .click({ selector: "@toSelect", index: titleId }, e2e.logOnClick)
      .waitForElementNotPresent("@menu", e2e.rerenderWait);
  },
  toggleIsAnonymous: function () {
    return this.click("@isAnonymous", e2e.logOnClick);
  },
  typeInAddress: function (addressInput) {
    return this.setValue("@addressSuggestionField", [addressInput]);
  },
  setAddressSuggestionFieldToEmpty: function () {
    this.click("@addressSuggestionField", e2e.logOnClick).api.keys(
      Array(50)
        .fill(this.api.Keys.BACK_SPACE)
        .concat(Array(50).fill(this.api.Keys.DELETE))
    );
    return this;
  },
  thereAreSuggestions: function () {
    this.waitForElementPresent(
      '[data-testid="suggestion-container"] > ul',
      e2e.rerenderWait
    ).api.pause(e2e.dataLoadWait);
    return this;
  },
  arrowDown: function () {
    return this.setValue("@addressSuggestionField", [this.api.Keys.ARROW_DOWN]);
  },
  addressSuggestionFieldNotPopulated: function () {
    return this.getValue("@addressSuggestionField", result => {
      this.assert.ok((result.value.length = 4));
    });
  },
  addressFieldsAreEmpty: function () {
    this.expect.element("@streetAddressInput").value.to.equal("");
    this.expect.element("@cityInput").value.to.equal("");
    this.expect.element("@stateInput").value.to.equal("");
    this.expect.element("@zipCodeInput").value.to.equal("");
    this.expect.element("@countryInput").value.to.equal("");
    return this;
  },
  selectSuggestion: function () {
    this.setValue("@addressSuggestionField", [this.api.Keys.ENTER]).api.pause(
      e2e.pause
    );
    return this;
  },
  addressFieldsAreNotEmpty: function () {
    this.expect.element("@streetAddressInput").value.to.not.equal("");
    this.expect.element("@cityInput").value.to.not.equal("");
    this.expect.element("@stateInput").value.to.not.equal("");
    this.expect.element("@zipCodeInput").value.to.not.equal("");
    this.expect.element("@countryInput").value.to.not.equal("");
    return this;
  },
  submitCivilianDialog: function () {
    return this.click("@submitEditCivilianButton", e2e.logOnClick);
  }
};

module.exports = {
  commands: [civilianDialogCommands],
  elements: {
    dialogTitle: {
      selector: "[data-testid='editDialogTitle']"
    },
    genderDropdown: {
      selector: '[data-testid="genderInput"]+div>button'
    },
    raceEthnicityDropdown: {
      selector: '[data-testid="raceEthnicityInput"]+div>button'
    },
    titleDropdown: {
      selector: '[data-testid="titleInput"]+div>button'
    },
    titleMenu: {
      selector: "[id='civilianTitleId']"
    },
    isAnonymous: {
      selector: "[data-testid='isAnonymous']"
    },
    addressSuggestionField: {
      selector: '[data-testid="addressSuggestionField"]'
    },
    suggestionContainer: {
      selector: '[data-testid="suggestion-container"] > ul'
    },
    streetAddressInput: {
      selector: '[data-testid="streetAddressInput"]'
    },
    cityInput: {
      selector: '[data-testid="cityInput"]'
    },
    stateInput: {
      selector: '[data-testid="stateInput"]'
    },
    zipCodeInput: {
      selector: '[data-testid="zipCodeInput"]'
    },
    countryInput: {
      selector: '[data-testid="countryInput"]'
    },
    submitEditCivilianButton: {
      selector: 'button[data-testid="submitEditCivilian"]'
    },
    menuOption: {
      selector: "[role='option']:last-child"
    },
    menu: {
      selector: ".MuiAutocomplete-popper"
    },
    toSelect: {
      selector: "li"
    }
  }
};
