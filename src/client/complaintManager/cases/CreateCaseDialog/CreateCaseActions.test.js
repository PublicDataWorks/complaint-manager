import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build";
import { Provider } from "react-redux";
import React from "react";
import { CreateCaseActions } from "./CreateCaseActions";
import {
  CIVILIAN_INITIATED,
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import CreateCaseButton from "../CreateCaseButton";
import { getIntakeSourcesSuccess } from "../../actionCreators/intakeSourceActionCreators";
import {
  changeInput,
  expectEventuallyToExist,
  selectDropdownOption
} from "../../../testHelpers";
import moment from "moment";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";
import { addressMustBeValid } from "../../../formValidations";
import {
  updateAddressInputValidity,
  updateSort
} from "../../actionCreators/casesActionCreators";
import normalizeAddress from "../../utilities/normalizeAddress";
import createCase from "../thunks/createCase";

jest.mock("../CaseDetails/CivilianDialog/MapServices/MapService");

jest.mock("../../intakeSources/thunks/getIntakeSourceDropdownValues", () =>
  jest.fn(values => ({
    type: "MOCK_THUNK",
    values
  }))
);

jest.mock("../thunks/createCase", () => creationDetails => ({
  type: "MOCK_CREATE_CASE_THUNK",
  creationDetails
}));

jest.mock("../../../formValidations", () => ({
  atLeastOneRequired: jest.fn((values, errorMessage, keys) => {
    return {};
  }),
  addressMustBeValid: jest.fn((addressValid, errors) => {
    return {};
  })
}));

jest.mock("../../utilities/normalizeAddress", () =>
  jest.fn(address => {
    return address;
  })
);

jest.mock("../CaseDetails/CivilianDialog/MapServices/MapService");

describe("CreateCaseActions", () => {
  let dispatchSpy, store, dialog, caseDetails;

  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(getFeaturesSuccess({ createCaseAddressInputFeature: true }));
    store.dispatch(updateSort(SORT_CASES_BY.CASE_REFERENCE, DESCENDING));

    dispatchSpy = jest.spyOn(store, "dispatch");

    dialog = mount(
      <Provider store={store}>
        <CreateCaseButton />
      </Provider>
    );

    dispatchSpy.mockClear();

    const createCaseButton = dialog.find(
      'button[data-test="createCaseButton"]'
    );
    createCaseButton.simulate("click");

    store.dispatch(
      getIntakeSourcesSuccess([["NOIPM Website", 1], ["Email", 2]])
    );

    caseDetails = {
      case: {
        complaintType: CIVILIAN_INITIATED,
        firstContactDate: moment(Date.now()).format("YYYY-MM-DD"),
        intakeSourceId: 1
      },
      civilian: {
        firstName: "Steven",
        lastName: "Universe",
        phoneNumber: "5748392098",
        address: {
          streetAddress: "123 Main St",
          city: "Nowhere",
          state: "XY",
          streetAddress2: "Number 2"
        }
      }
    };

    changeInput(
      dialog,
      '[data-test="firstNameInput"]',
      caseDetails.civilian.firstName
    );
    changeInput(
      dialog,
      '[data-test="lastNameInput"]',
      caseDetails.civilian.lastName
    );
    changeInput(
      dialog,
      '[data-test="phoneNumberInput"]',
      caseDetails.civilian.phoneNumber
    );
    selectDropdownOption(
      dialog,
      '[data-test="intakeSourceDropdown"]',
      "NOIPM Website"
    );
  });
  describe("creating a case", () => {
    let addressSuggestionField, submitButton;

    beforeEach(() => {
      addressSuggestionField = dialog.find(
        '[data-test="addressSuggestionField"] > input'
      );
      submitButton = dialog.find('LinkButton[data-test="createCaseOnly"]');
    });
    test("should create a case with address", async () => {
      changeInput(
        dialog,
        '[data-test="addressSuggestionField"] > input',
        caseDetails.civilian.address.streetAddress
      );
      addressSuggestionField.simulate("blur");

      const fillAddressToConfirmButton = dialog
        .find('[data-test="fillAddressToConfirm"]')
        .last();
      changeInput(
        dialog,
        '[data-test="streetAddress2Input"]',
        caseDetails.civilian.address.streetAddress2
      );
      await expectEventuallyToExist(
        dialog,
        '[data-test="fillAddressToConfirm"]'
      );
      fillAddressToConfirmButton.simulate("click");

      submitButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          creationDetails: expect.objectContaining({
            caseDetails: expect.objectContaining({
              civilian: expect.objectContaining({
                address: expect.objectContaining({
                  streetAddress: "200 E Randolph St",
                  streetAddress2: "Number 2",
                  zipCode: "60601",
                  state: "IL",
                  city: "Chicago",
                  country: "US"
                })
              })
            })
          })
        })
      );
    });
    describe("adding address onto civilian object", () => {
      test("should call addressMustBeValid when address provided on civilian", async () => {
        changeInput(
          dialog,
          '[data-test="addressSuggestionField"] > input',
          caseDetails.civilian.address.streetAddress
        );
        addressSuggestionField.simulate("blur");

        const fillAddressToConfirmButton = dialog
          .find('[data-test="fillAddressToConfirm"]')
          .last();
        changeInput(
          dialog,
          '[data-test="streetAddress2Input"]',
          caseDetails.civilian.address.streetAddress2
        );
        await expectEventuallyToExist(
          dialog,
          '[data-test="fillAddressToConfirm"]'
        );
        fillAddressToConfirmButton.simulate("click");

        const dummyAddressValid = "I am valid";
        store.dispatch(updateAddressInputValidity(dummyAddressValid));

        submitButton.simulate("click");

        expect(addressMustBeValid).toHaveBeenCalledWith(dummyAddressValid, {});
      });
      test("should return error if address not valid", async () => {
        addressMustBeValid.mockClear();
        addressMustBeValid.mockImplementationOnce((addressValid, errors) => {
          errors.testError = "Some Error Message";
          return errors;
        });
        changeInput(
          dialog,
          '[data-test="addressSuggestionField"] > input',
          caseDetails.civilian.address.streetAddress
        );
        addressSuggestionField.simulate("blur");

        const fillAddressToConfirmButton = dialog
          .find('[data-test="fillAddressToConfirm"]')
          .last();
        changeInput(
          dialog,
          '[data-test="streetAddress2Input"]',
          caseDetails.civilian.address.streetAddress2
        );
        await expectEventuallyToExist(
          dialog,
          '[data-test="fillAddressToConfirm"]'
        );
        fillAddressToConfirmButton.simulate("click");

        const dummyAddressValid = "I am valid";
        store.dispatch(updateAddressInputValidity(dummyAddressValid));

        submitButton.simulate("click");

        expect(dispatchSpy).toBeCalledWith(
          expect.objectContaining({ error: true })
        );
      });
      test("should call normalizeAddress when address provided on civilian", async () => {
        changeInput(
          dialog,
          '[data-test="addressSuggestionField"] > input',
          caseDetails.civilian.address.streetAddress
        );
        addressSuggestionField.simulate("blur");

        const fillAddressToConfirmButton = dialog
          .find('[data-test="fillAddressToConfirm"]')
          .last();
        changeInput(
          dialog,
          '[data-test="streetAddress2Input"]',
          caseDetails.civilian.address.streetAddress2
        );
        await expectEventuallyToExist(
          dialog,
          '[data-test="fillAddressToConfirm"]'
        );
        fillAddressToConfirmButton.simulate("click");

        submitButton.simulate("click");

        expect(normalizeAddress).toHaveBeenCalledWith({
          city: "Chicago",
          country: "US",
          lat: 41.8855572,
          lng: -87.6214826,
          placeId: "ChIJObywJqYsDogR_4XaBVM4ge8",
          state: "IL",
          streetAddress: "200 E Randolph St",
          streetAddress2: "Number 2",
          zipCode: "60601"
        });
      });
    });
  });
});
