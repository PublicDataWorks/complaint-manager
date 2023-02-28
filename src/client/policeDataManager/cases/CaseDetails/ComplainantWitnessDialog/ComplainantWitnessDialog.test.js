import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../../createConfiguredStore";
import ComplainantWitnessDialog from "./ComplainantWitnessDialog";
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
import {
  CIVILIAN_FORM_NAME,
  GET_CASE_DETAILS_SUCCESS,
  GET_FEATURES_SUCCEEDED,
  NUMBER_OF_COMPLAINANT_TYPES_BEFORE_SWITCHING_TO_DROPDOWN,
  SHOW_FORM
} from "../../../../../sharedUtilities/constants";
import { getRaceEthnicitiesSuccess } from "../../../actionCreators/raceEthnicityActionCreators";
import getGenderIdentityDropdownValues from "../../../genderIdentities/thunks/getGenderIdentityDropdownValues";
import getRaceEthnicityDropdownValues from "../../../raceEthnicities/thunks/getRaceEthnicityDropdownValues";
import getCivilianTitleDropdownValues from "../../../civilianTitles/thunks/getCivilianTitleDropdownValues";
import { getGenderIdentitiesSuccess } from "../../../actionCreators/genderIdentityActionCreators";
import { getCivilianTitlesSuccess } from "../../../actionCreators/civilianTitleActionCreators";
import { push } from "connected-react-router";
import ComplainantTypeRadioGroup from "../../CreateCaseDialog/ComplainantTypeRadioGroup";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

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

describe("complainant/witness dialog", () => {
  let complainantWitnessDialog,
    store,
    dispatchSpy,
    caseCivilian,
    save,
    submitAction;

  const unknownGenderIdentity = ["Unknown", 2];
  const otherGenderIdentity = ["Other", 1];

  const doctorMrsCivilianTitle = ["DoctorMrs.", 2];
  const profCivilianTitle = ["Prof.", 1];
  const aTitleCivilianTitle = ["A Title", 3];

  beforeEach(() => {
    console.warn = () => {};
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

    store.dispatch({
      type: GET_CASE_DETAILS_SUCCESS,
      caseDetails: { id: 1 }
    });

    dispatchSpy = jest.spyOn(store, "dispatch");
    submitAction = jest.fn(() => ({ type: "MOCK_CIVILIAN_THUNK" }));

    store.dispatch(
      openCivilianDialog("Test Title", "Test Submit Text", submitAction)
    );

    complainantWitnessDialog = mount(
      <Provider store={store}>
        <ComplainantWitnessDialog />
      </Provider>
    );

    complainantWitnessDialog.update();
    save = complainantWitnessDialog.find(
      'button[data-testid="submitEditCivilian"]'
    );
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

  describe("choosePersonTypeInAddDialog is false so the civilian fields show", () => {
    describe("address", () => {
      test("should disable address entry when google address suggestion service is not available", () => {
        const otherStore = createConfiguredStore();

        otherStore.dispatch(
          openCivilianDialog("Test Title", "Test Submit Text", submitAction)
        );

        const otherCivilianDialog = mount(
          <Provider store={otherStore}>
            <ComplainantWitnessDialog />
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

    describe("race and ethnicity", () => {
      let raceDropdown;
      beforeEach(() => {
        raceDropdown = complainantWitnessDialog
          .find('[data-testid="raceDropdown"]')
          .last();
      });

      test("should have a label race/ethnicity", () => {
        expect(raceDropdown.find("label").text()).toEqual("Race/Ethnicity");
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
          complainantWitnessDialog,
          '[data-testid="firstNameInput"]',
          civilianToSubmit.firstName
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="lastNameInput"]',
          civilianToSubmit.lastName
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="birthDateInput"]',
          civilianToSubmit.birthDate
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="phoneNumberInput"]',
          civilianToSubmit.phoneNumber
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="emailInput"]',
          civilianToSubmit.email
        );
        selectDropdownOption(
          complainantWitnessDialog,
          '[data-testid="genderDropdown"]',
          "Other"
        );
        selectDropdownOption(
          complainantWitnessDialog,
          '[data-testid="raceDropdown"]',
          "Japanese"
        );
        selectDropdownOption(
          complainantWitnessDialog,
          '[data-testid="titleDropdown"]',
          doctorMrsCivilianTitle[0]
        );
        const phoneNumberField = complainantWitnessDialog.find(
          'div[data-testid="phoneNumberField"]'
        );
        const phoneNumberInput = complainantWitnessDialog.find(
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
          complainantWitnessDialog,
          '[data-testid="firstNameInput"]',
          civilianToSubmit.firstName
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="middleInitialInput"]',
          civilianToSubmit.middleInitial
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="lastNameInput"]',
          civilianToSubmit.lastName
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="suffixInput"]',
          civilianToSubmit.suffix
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="birthDateInput"]',
          civilianToSubmit.birthDate
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="phoneNumberInput"]',
          civilianToSubmit.phoneNumber
        );
        changeInput(
          complainantWitnessDialog,
          '[data-testid="emailInput"]',
          civilianToSubmit.email
        );
        selectDropdownOption(
          complainantWitnessDialog,
          '[data-testid="genderDropdown"]',
          unknownGenderIdentity[0]
        );
        selectDropdownOption(
          complainantWitnessDialog,
          '[data-testid="raceDropdown"]',
          "Japanese"
        );
        selectDropdownOption(
          complainantWitnessDialog,
          '[data-testid="titleDropdown"]',
          doctorMrsCivilianTitle[0]
        );

        save.simulate("click");
        expect(submitAction).toHaveBeenCalledWith(
          expect.objectContaining({
            ...civilianToSubmit,
            genderIdentityId: unknownGenderIdentity[1]
          }),
          undefined
        );
      });
    });
  });

  describe("choosePersonTypeInAddDialog is true so person type must be selected", () => {
    beforeEach(() => {
      store.dispatch({
        type: GET_FEATURES_SUCCEEDED,
        features: { choosePersonTypeInAddDialog: true }
      });

      complainantWitnessDialog.update();
    });

    test("should show radio buttons or dropdown (depending on the number) for choosing a person type", () => {
      if (
        Object.keys(PERSON_TYPE).length >
        NUMBER_OF_COMPLAINANT_TYPES_BEFORE_SWITCHING_TO_DROPDOWN
      ) {
        expect(
          complainantWitnessDialog.find(
            "[data-testid='complainant-type-dropdown']"
          )
        ).toHaveLength(1);
      } else {
        expect(
          complainantWitnessDialog.find(ComplainantTypeRadioGroup)
        ).toHaveLength(1);
      }
    });

    test("should show subtype dropdown if a type with subtypes is selected", () => {
      let type = Object.values(PERSON_TYPE).find(
        pType => pType.subTypes?.length
      );
      if (type) {
        if (
          Object.keys(PERSON_TYPE).length >
          NUMBER_OF_COMPLAINANT_TYPES_BEFORE_SWITCHING_TO_DROPDOWN
        ) {
          selectDropdownOption(
            complainantWitnessDialog,
            "[data-testid='complainant-type-dropdown-autocomplete']",
            type.isEmployee ? type.employeeDescription : type.description
          );
        } else {
          complainantWitnessDialog
            .find(
              `label[data-testid="${(type.isEmployee
                ? type.employeeDescription
                : type.description
              )
                .toLowerCase()
                .replaceAll(" ", "-")}-radio-button}"]`
            )
            .simulate("click");
        }

        expect(
          complainantWitnessDialog.find(`[data-testid="personSubtypeDropdown"]`)
        ).toHaveLength(1);
      }
    });

    Object.keys(PERSON_TYPE)
      .filter(key => !key.includes("UNKNOWN"))
      .forEach(key => {
        describe(`PERSON_TYPE: ${PERSON_TYPE[key].description}`, () => {
          beforeEach(() => {
            if (
              Object.keys(PERSON_TYPE).length >
              NUMBER_OF_COMPLAINANT_TYPES_BEFORE_SWITCHING_TO_DROPDOWN
            ) {
              selectDropdownOption(
                complainantWitnessDialog,
                "[data-testid='complainant-type-dropdown-autocomplete']",
                PERSON_TYPE[key].isEmployee
                  ? PERSON_TYPE[key].employeeDescription
                  : PERSON_TYPE[key].description
              );
            } else {
              complainantWitnessDialog
                .find(
                  `label[data-testid="${(PERSON_TYPE[key].isEmployee
                    ? PERSON_TYPE[key].employeeDescription
                    : PERSON_TYPE[key].description
                  )
                    .toLowerCase()
                    .replaceAll(" ", "-")}-radio-button"]`
                )
                .simulate("click");
            }
          });

          if (PERSON_TYPE[key].createDialogAction === SHOW_FORM) {
            test("should call submitAction when form is correctly filled out and submitted", () => {
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
                complainantWitnessDialog,
                '[data-testid="firstNameInput"]',
                civilianToSubmit.firstName
              );
              changeInput(
                complainantWitnessDialog,
                '[data-testid="middleInitialInput"]',
                civilianToSubmit.middleInitial
              );
              changeInput(
                complainantWitnessDialog,
                '[data-testid="lastNameInput"]',
                civilianToSubmit.lastName
              );
              changeInput(
                complainantWitnessDialog,
                '[data-testid="suffixInput"]',
                civilianToSubmit.suffix
              );
              changeInput(
                complainantWitnessDialog,
                '[data-testid="birthDateInput"]',
                civilianToSubmit.birthDate
              );
              changeInput(
                complainantWitnessDialog,
                '[data-testid="phoneNumberInput"]',
                civilianToSubmit.phoneNumber
              );
              changeInput(
                complainantWitnessDialog,
                '[data-testid="emailInput"]',
                civilianToSubmit.email
              );
              selectDropdownOption(
                complainantWitnessDialog,
                '[data-testid="genderDropdown"]',
                unknownGenderIdentity[0]
              );
              selectDropdownOption(
                complainantWitnessDialog,
                '[data-testid="raceDropdown"]',
                "Japanese"
              );
              selectDropdownOption(
                complainantWitnessDialog,
                '[data-testid="titleDropdown"]',
                doctorMrsCivilianTitle[0]
              );

              save.simulate("click");
              expect(submitAction).toHaveBeenCalledWith(
                expect.objectContaining({
                  ...civilianToSubmit,
                  genderIdentityId: unknownGenderIdentity[1],
                  personType: key
                }),
                undefined
              );
            });
          } else {
            test("should redirect to correct page when clicking submit", () => {
              save.simulate("click");
              expect(
                dispatchSpy.mock.calls.find(
                  call => call[0].type === "@@router/CALL_HISTORY_METHOD"
                )[0]
              ).toEqual(push(`/cases/1${PERSON_TYPE[key].createDialogAction}`));
            });
          }
        });
      });
  });

  describe("dialog dismissal", () => {
    test("should dismiss when cancel button is clicked", async () => {
      const cancel = complainantWitnessDialog.find(
        'button[data-testid="cancelEditCivilian"]'
      );
      cancel.simulate("click");

      complainantWitnessDialog.update();

      expect(dispatchSpy).toHaveBeenCalledWith(closeEditCivilianDialog());
      await expectEventuallyNotToExist(
        complainantWitnessDialog,
        '[data-testid="editDialogTitle"]'
      );
    });
  });
});
