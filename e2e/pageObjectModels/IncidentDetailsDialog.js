const e2e = require("./e2eUtilities.js");

const incidentDetailsDialogCommands = {
  dialogIsOpen: function () {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  typeInAddress: function (addressInput) {
    return this.setValue("@addressSuggestionField", [addressInput]);
  },
  saveIncidentDetails: function () {
    return this.waitForElementVisible(
      "@saveIncidentDetailsButton",
      e2e.rerenderWait
    ).click("@saveIncidentDetailsButton", e2e.logOnClick);
  },
  fillAddress: function () {
    return this.waitForElementVisible(
      "@fillAddressLink",
      e2e.rerenderWait
    ).click("@fillAddressLink", e2e.logOnClick);
  },
  setIncidentDate: function () {
    return this.waitForElementVisible(
      "@incidentDate",
      e2e.rerenderWait
    ).setValue("@incidentDate", "12/20/2017");
  },
  setIncidentTime: function () {
    return this.waitForElementVisible(
      "@incidentTime",
      e2e.rerenderWait
    ).setValue("@incidentTime", "23:111");
  },
  setDistrict: function (districtId) {
    return this.waitForElementVisible("@districtDropdown", e2e.rerenderWait)
      .click("@districtDropdown", e2e.logOnClick)
      .waitForElementVisible("@districtMenu", e2e.rerenderWait)
      .click({ selector: "@districtToSelect", index: districtId }, e2e.logOnClick)
      .waitForElementNotPresent("@districtMenu", e2e.rerenderWait);
  }
};

module.exports = {
  commands: [incidentDetailsDialogCommands],
  elements: {
    dialogTitle: {
      selector: "[data-testid='editIncidentDetailsTitle']"
    },
    addressSuggestionField: {
      selector: '[data-testid="addressSuggestionField"]'
    },
    saveIncidentDetailsButton: {
      selector: '[data-testid="saveIncidentDetailsButton"]'
    },
    fillAddressLink: {
      selector: '[data-testid="fillAddressToConfirm"]'
    },
    incidentDate: {
      selector: '[data-testid="editIncidentDateInput"]'
    },
    incidentTime: {
      selector: '[data-testid="editIncidentTimeInput"]'
    },
    districtDropdown: {
      selector: '[data-testid="districtInput"]+div>button'
    },
    districtMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    districtToSelect: {
      selector: "li"
    }
  }
};
