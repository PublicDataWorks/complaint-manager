import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import CivilianDialog from "./CivilianDialog";
import {
  closeEditCivilianDialog,
  openCivilianDialog
} from "../../../actionCreators/casesActionCreators";
import {
  changeInput,
  containsValue,
  expectEventuallyNotToExist,
  selectDropdownOption
} from "../../../testHelpers";
import { initialize } from "redux-form";
import Address from "../../../testUtilities/Address";
import Civilian from "../../../testUtilities/civilian";
import { CIVILIAN_FORM_NAME } from "../../../../sharedUtilities/constants";
import { getRaceEthnicitiesSuccess } from "../../../actionCreators/raceEthnicityActionCreators";

jest.mock("../../thunks/editCivilian", () =>
  jest.fn(() => ({ type: "MOCK_CIVILIAN_REQUESTED" }))
);

jest.mock("./MapServices/MapService", () => {
  return jest.fn().mockImplementation(() => ({
    healthCheck: callback => {
      callback({ googleAddressServiceIsAvailable: false });
    },

    getSuggestionValue: suggestion => {
      return suggestion.description;
    },

    onFetchSuggestions: (input, callback) => {
      callback([{ description: "200 East Randolph Street, Chicago, IL, US" }]);
    },

    onSuggestionSelected: (suggestion, successCallback, failureCallback) => {
      successCallback({
        streetAddress: "200 E Randolph St",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "US"
      });
    }
  }));
});

jest.mock(
  "../../../raceEthnicities/thunks/getRaceEthnicityDropdownValues",
  () =>
    jest.fn(values => ({
      type: "MOCK_GET_RACE_ETHNICITY_THUNK",
      values
    }))
);

describe("civilian dialog", () => {
  let civilianDialog, store, dispatchSpy, caseCivilian, save, submitAction;
  beforeEach(() => {
    store = createConfiguredStore();

    const addressToSubmit = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withStreetAddress("200 E Randolph Street")
      .withStreetAddress2("FL 25")
      .withCity("Chicago")
      .withState("IL")
      .withZipCode("60601")
      .withCountry("US")
      .build();

    caseCivilian = new Civilian.Builder()
      .defaultCivilian()
      .withFirstName("test first name")
      .withMiddleInitial("T")
      .withLastName("test last name")
      .withSuffix("test suffix")
      .withAddress(addressToSubmit)
      .withId(undefined)
      .withEmail(undefined)
      .withPhoneNumber(undefined)
      .withGenderIdentity(undefined)
      .withRaceEthnicityId(undefined)
      .withBirthDate(undefined)
      .withTitle(undefined)
      .build();

    store.dispatch(initialize(CIVILIAN_FORM_NAME, caseCivilian));
    store.dispatch(
      getRaceEthnicitiesSuccess([["Japanese", 1], ["unknown2", 2]])
    );
    dispatchSpy = jest.spyOn(store, "dispatch");
    submitAction = jest.fn(() => ({ type: "MOCK_CIVILIAN_THUNK" }));

    store.dispatch(
      openCivilianDialog("Test Title", "Test Submit Text", submitAction)
    );

    civilianDialog = mount(
      <Provider store={store}>
        <CivilianDialog />
      </Provider>
    );

    civilianDialog.update();
    save = civilianDialog.find('button[data-test="submitEditCivilian"]');
  });

  describe("address", () => {
    test("should disable address entry when google address suggestion service is not available", () => {
      const otherStore = createConfiguredStore();

      otherStore.dispatch(
        openCivilianDialog("Test Title", "Test Submit Text", submitAction)
      );

      const otherCivilianDialog = mount(
        <Provider store={otherStore}>
          <CivilianDialog />
        </Provider>
      );

      otherCivilianDialog.update();

      containsValue(
        otherCivilianDialog,
        '[data-test="addressSuggestionField"] > input',
        "Address lookup is down, please try again later"
      );
    });
  });

  describe("gender", () => {
    let genderDropdown;
    beforeEach(() => {
      genderDropdown = civilianDialog
        .find('[data-test="genderDropdown"]')
        .last();
    });

    test("should show error if not set on save", () => {
      save.simulate("click");
      expect(genderDropdown.text()).toContain("Please enter Gender Identity");
    });
  });

  describe("race and ethnicity", () => {
    let raceDropdown;
    beforeEach(() => {
      raceDropdown = civilianDialog.find('[data-test="raceDropdown"]').last();
    });

    test("should have a label race/ethnicity", () => {
      expect(raceDropdown.find("label").text()).toEqual("Race/Ethnicity *");
    });

    test("should show error if not set on save", () => {
      save.simulate("click");
      expect(raceDropdown.text()).toContain("Please enter Race/Ethnicity");
    });
  });

  describe("title", () => {
    let titleDropdown;
    beforeEach(() => {
      titleDropdown = civilianDialog.find('[data-test="titleDropdown"]').last();
    });

    test("should show error if not set on save", () => {
      save.simulate("click");
      expect(titleDropdown.text()).toContain("Please enter Title");
    });
  });

  describe("email and phone number", () => {
    test("should display phone error when phone and email marked as touched on form submit", () => {
      let civilianToSubmit = new Civilian.Builder()
        .defaultCivilian()
        .withFirstName("test first name")
        .withLastName("test last name")
        .withRaceEthnicityId(1)
        .withGenderIdentity("Unknown")
        .withEmail("")
        .withPhoneNumber("")
        .withTitle("Miss")
        .build();

      changeInput(
        civilianDialog,
        '[data-test="firstNameInput"]',
        civilianToSubmit.firstName
      );
      changeInput(
        civilianDialog,
        '[data-test="lastNameInput"]',
        civilianToSubmit.lastName
      );
      changeInput(
        civilianDialog,
        '[data-test="birthDateInput"]',
        civilianToSubmit.birthDate
      );
      changeInput(
        civilianDialog,
        '[data-test="phoneNumberInput"]',
        civilianToSubmit.phoneNumber
      );
      changeInput(
        civilianDialog,
        '[data-test="emailInput"]',
        civilianToSubmit.email
      );
      selectDropdownOption(
        civilianDialog,
        '[data-test="genderDropdown"]',
        civilianToSubmit.genderIdentity
      );
      selectDropdownOption(
        civilianDialog,
        '[data-test="raceDropdown"]',
        "Japanese"
      );
      selectDropdownOption(
        civilianDialog,
        '[data-test="titleDropdown"]',
        civilianToSubmit.title
      );
      const phoneNumberField = civilianDialog.find(
        'div[data-test="phoneNumberField"]'
      );
      const phoneNumberInput = civilianDialog.find(
        'input[data-test="phoneNumberInput"]'
      );
      phoneNumberInput.simulate("focus");
      phoneNumberInput.simulate("blur");
      save.simulate("click");
      expect(phoneNumberField.text()).toContain(
        "Please enter phone number or email address"
      );
    });
  });

  describe("dialog dismissal", () => {
    test("should dismiss when cancel button is clicked", async () => {
      const cancel = civilianDialog.find(
        'button[data-test="cancelEditCivilian"]'
      );
      cancel.simulate("click");

      civilianDialog.update();

      expect(dispatchSpy).toHaveBeenCalledWith(closeEditCivilianDialog());
      await expectEventuallyNotToExist(
        civilianDialog,
        '[data-test="editDialogTitle"]'
      );
    });
  });

  describe("on submit", () => {
    test("should submit form with address", () => {
      const civilianToSubmit = new Civilian.Builder()
        .defaultCivilian()
        .withFirstName("Foo")
        .withLastName("Bar")
        .withMiddleInitial("Y")
        .withSuffix("updated test suffix")
        .withBirthDate("2012-02-13")
        .withGenderIdentity("Other")
        .withRaceEthnicityId(1)
        .withPhoneNumber("1234567890")
        .withEmail("example@test.com")
        .withAddress(caseCivilian.address)
        .withTitle("Mr.")
        .withId(undefined)
        .build();

      changeInput(
        civilianDialog,
        '[data-test="firstNameInput"]',
        civilianToSubmit.firstName
      );
      changeInput(
        civilianDialog,
        '[data-test="middleInitialInput"]',
        civilianToSubmit.middleInitial
      );
      changeInput(
        civilianDialog,
        '[data-test="lastNameInput"]',
        civilianToSubmit.lastName
      );
      changeInput(
        civilianDialog,
        '[data-test="suffixInput"]',
        civilianToSubmit.suffix
      );
      changeInput(
        civilianDialog,
        '[data-test="birthDateInput"]',
        civilianToSubmit.birthDate
      );
      changeInput(
        civilianDialog,
        '[data-test="phoneNumberInput"]',
        civilianToSubmit.phoneNumber
      );
      changeInput(
        civilianDialog,
        '[data-test="emailInput"]',
        civilianToSubmit.email
      );
      selectDropdownOption(
        civilianDialog,
        '[data-test="genderDropdown"]',
        civilianToSubmit.genderIdentity
      );
      selectDropdownOption(
        civilianDialog,
        '[data-test="raceDropdown"]',
        "Japanese"
      );
      selectDropdownOption(
        civilianDialog,
        '[data-test="titleDropdown"]',
        civilianToSubmit.title
      );

      save.simulate("click");
      expect(submitAction).toHaveBeenCalledWith(civilianToSubmit);
    });
  });
});
