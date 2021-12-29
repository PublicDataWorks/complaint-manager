import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../../createConfiguredStore";
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
} from "../../../../testHelpers";
import { change, initialize, reset } from "redux-form";
import Address from "../../../../../sharedTestHelpers/Address";
import Civilian from "../../../../../sharedTestHelpers/civilian";
import { CIVILIAN_FORM_NAME } from "../../../../../sharedUtilities/constants";
import { getRaceEthnicitiesSuccess } from "../../../actionCreators/raceEthnicityActionCreators";
import getGenderIdentityDropdownValues from "../../../genderIdentities/thunks/getGenderIdentityDropdownValues";
import getRaceEthnicityDropdownValues from "../../../raceEthnicities/thunks/getRaceEthnicityDropdownValues";
import getCivilianTitleDropdownValues from "../../../civilianTitles/thunks/getCivilianTitleDropdownValues";
import { getGenderIdentitiesSuccess } from "../../../actionCreators/genderIdentityActionCreators";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import { getCivilianTitlesSuccess } from "../../../actionCreators/civilianTitleActionCreators";

jest.mock("../../thunks/editCivilian", () =>
  jest.fn(() => ({ type: "MOCK_CIVILIAN_REQUESTED" }))
);

jest.mock("./MapServices/MapService", () => {
  return jest.fn().mockImplementation(() => ({
    healthCheck: callback => {
      callback({ googleAddressServiceIsAvailable: false });
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

jest.mock(
  "../../../genderIdentities/thunks/getGenderIdentityDropdownValues",
  () =>
    jest.fn(() => ({
      type: "MOCK_GET_GENDER_IDENTITIES_THUNK"
    }))
);

jest.mock("../../../civilianTitles/thunks/getCivilianTitleDropdownValues", () =>
  jest.fn(() => ({
    type: "MOCK_GET_CIVILIAN_TITLES_THUNK"
  }))
);

describe("civilian dialog", () => {
  let civilianDialog, store, dispatchSpy, caseCivilian, save, submitAction;

  const unknownGenderIdentity = ["Unknown", 2];
  const otherGenderIdentity = ["Other", 1];

  const doctorMrsCivilianTitle = ["DoctorMrs.", 2];
  const profCivilianTitle = ["Prof.", 1];
  const aTitleCivilianTitle = ["A Title", 3];

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
      .withRaceEthnicityId(undefined)
      .withBirthDate(undefined)
      .withCivilianTitleId(undefined)
      .build();

    store.dispatch(initialize(CIVILIAN_FORM_NAME, caseCivilian));
    store.dispatch(
      getRaceEthnicitiesSuccess([
        ["Japanese", 1],
        ["unknown2", 2]
      ])
    );
    store.dispatch(
      getGenderIdentitiesSuccess([unknownGenderIdentity, otherGenderIdentity])
    );
    store.dispatch(
      getCivilianTitlesSuccess([
        profCivilianTitle,
        doctorMrsCivilianTitle,
        aTitleCivilianTitle
      ])
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
    save = civilianDialog.find('button[data-testid="submitEditCivilian"]');
  });

  test("should call getGenderIdentityDropdownValues on mount", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getGenderIdentityDropdownValues());
  });

  test("should call getRaceEthnicityDropdownValues on mount", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getRaceEthnicityDropdownValues());
  });

  test("should call getCivilianTitleDropdownValues on mount", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getCivilianTitleDropdownValues());
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
        '[data-testid="addressSuggestionField"]',
        "Address lookup is down, please try again later"
      );
    });
  });

  describe("gender", () => {
    let genderDropdown;
    beforeEach(() => {
      genderDropdown = civilianDialog
        .find('[data-testid="genderDropdown"]')
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
      raceDropdown = civilianDialog.find('[data-testid="raceDropdown"]').last();
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
      titleDropdown = civilianDialog
        .find('[data-testid="titleDropdown"]')
        .last();
    });

    test("should show error if not set on save", () => {
      save.simulate("click");
      expect(titleDropdown.text()).toContain("Please enter Title");
    });
  });

  describe("email, phone number, and address", () => {
    beforeEach(() => {
      caseCivilian.address = undefined;
      store.dispatch(change(CIVILIAN_FORM_NAME, caseCivilian));
    });

    afterEach(() => {
      store.dispatch(reset(CIVILIAN_FORM_NAME));
    });

    test("should display phone error when phone and email marked as touched on form submit", () => {
      let civilianToSubmit = new Civilian.Builder()
        .defaultCivilian()
        .withFirstName("test first name")
        .withLastName("test last name")
        .withEmail("")
        .withPhoneNumber("")
        .withCivilianTitleId(doctorMrsCivilianTitle[1])
        .withNoAddress()
        .build();

      changeInput(
        civilianDialog,
        '[data-testid="firstNameInput"]',
        civilianToSubmit.firstName
      );
      changeInput(
        civilianDialog,
        '[data-testid="lastNameInput"]',
        civilianToSubmit.lastName
      );
      changeInput(
        civilianDialog,
        '[data-testid="birthDateInput"]',
        civilianToSubmit.birthDate
      );
      changeInput(
        civilianDialog,
        '[data-testid="phoneNumberInput"]',
        civilianToSubmit.phoneNumber
      );
      changeInput(
        civilianDialog,
        '[data-testid="emailInput"]',
        civilianToSubmit.email
      );
      selectDropdownOption(
        civilianDialog,
        '[data-testid="genderDropdown"]',
        "Other"
      );
      selectDropdownOption(
        civilianDialog,
        '[data-testid="raceDropdown"]',
        "Japanese"
      );
      selectDropdownOption(
        civilianDialog,
        '[data-testid="titleDropdown"]',
        doctorMrsCivilianTitle[0]
      );
      const phoneNumberField = civilianDialog.find(
        'div[data-testid="phoneNumberField"]'
      );
      const phoneNumberInput = civilianDialog.find(
        'input[data-testid="phoneNumberInput"]'
      );
      phoneNumberInput.simulate("focus");
      phoneNumberInput.simulate("blur");
      save.simulate("click");
      expect(phoneNumberField.text()).toContain(
        "Please enter one form of contact"
      );
    });
  });

  describe("dialog dismissal", () => {
    test("should dismiss when cancel button is clicked", async () => {
      const cancel = civilianDialog.find(
        'button[data-testid="cancelEditCivilian"]'
      );
      cancel.simulate("click");

      civilianDialog.update();

      expect(dispatchSpy).toHaveBeenCalledWith(closeEditCivilianDialog());
      await expectEventuallyNotToExist(
        civilianDialog,
        '[data-testid="editDialogTitle"]'
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
        .withGenderIdentityId(1)
        .withRaceEthnicityId(1)
        .withPhoneNumber("1234567890")
        .withEmail("example@test.com")
        .withAddress(caseCivilian.address)
        .withCivilianTitleId(doctorMrsCivilianTitle[1])
        .withId(undefined)
        .build();

      changeInput(
        civilianDialog,
        '[data-testid="firstNameInput"]',
        civilianToSubmit.firstName
      );
      changeInput(
        civilianDialog,
        '[data-testid="middleInitialInput"]',
        civilianToSubmit.middleInitial
      );
      changeInput(
        civilianDialog,
        '[data-testid="lastNameInput"]',
        civilianToSubmit.lastName
      );
      changeInput(
        civilianDialog,
        '[data-testid="suffixInput"]',
        civilianToSubmit.suffix
      );
      changeInput(
        civilianDialog,
        '[data-testid="birthDateInput"]',
        civilianToSubmit.birthDate
      );
      changeInput(
        civilianDialog,
        '[data-testid="phoneNumberInput"]',
        civilianToSubmit.phoneNumber
      );
      changeInput(
        civilianDialog,
        '[data-testid="emailInput"]',
        civilianToSubmit.email
      );
      selectDropdownOption(
        civilianDialog,
        '[data-testid="genderDropdown"]',
        unknownGenderIdentity[0]
      );
      selectDropdownOption(
        civilianDialog,
        '[data-testid="raceDropdown"]',
        "Japanese"
      );
      selectDropdownOption(
        civilianDialog,
        '[data-testid="titleDropdown"]',
        doctorMrsCivilianTitle[0]
      );

      save.simulate("click");
      expect(submitAction).toHaveBeenCalledWith(
        expect.objectContaining({
          ...civilianToSubmit,
          genderIdentityId: unknownGenderIdentity[1],
          isAnonymous: undefined
        })
      );
    });
  });
});
