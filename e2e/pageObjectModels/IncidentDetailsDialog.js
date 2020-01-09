const e2e = require("./e2eUtilities.js");

const incidentDetailsDialogCommands = {
  dialogIsOpen: function() {
    return this.waitForElementVisible("@dialogTitle", e2e.rerenderWait);
  },
  typeInAddress: function(addressInput) {
    return this.setValue("@addressSuggestionField", [addressInput]);
  },
  saveIncidentDetails: function() {
    return this.waitForElementVisible(
      "@saveIncidentDetailsButton",
      e2e.rerenderWait
    ).click("@saveIncidentDetailsButton");
  },
  fillAddress: function() {
    return this.waitForElementVisible(
      "@fillAddressLink",
      e2e.rerenderWait
    ).click("@fillAddressLink");
  },
  setIncidentDate: function() {
    return this.waitForElementVisible(
      "@incidentDate",
      e2e.rerenderWait
    ).setValue("@incidentDate", "12/20/2017");
  },
  setIncidentTime: function() {
    return this.waitForElementVisible(
      "@incidentTime",
      e2e.rerenderWait
    ).setValue("@incidentTime", "23:111");
  },
  setDistrict: function(districtId) {
    return this.waitForElementVisible("@districtDropdown", e2e.rerenderWait)
      .click("@districtDropdown")
      .waitForElementVisible("@districtMenu", e2e.rerenderWait)
      .click({ selector: "@districtToSelect", index: districtId + 1 })
      .waitForElementNotPresent("@districtMenu", e2e.rerenderWait);
  }
};

module.exports = {
  commands: [incidentDetailsDialogCommands],
  elements: {
    dialogTitle: {
      selector: "[data-test='editIncidentDetailsTitle']"
    },
    addressSuggestionField: {
      selector: '[data-test="addressSuggestionField"] > input'
    },
    saveIncidentDetailsButton: {
      selector: '[data-test="saveIncidentDetailsButton"]'
    },
    fillAddressLink: {
      selector: '[data-test="fillAddressToConfirm"]'
    },
    incidentDate: {
      selector: '[data-test="editIncidentDateInput"]'
    },
    incidentTime: {
      selector: '[data-test="editIncidentTimeInput"]'
    },
    districtDropdown: {
      selector: '[data-test="districtInput"]+div>button'
    },
    districtMenu: {
      selector: ".MuiAutocomplete-popper"
    },
    districtToSelect: {
      selector: "li"
    }
  }
};
