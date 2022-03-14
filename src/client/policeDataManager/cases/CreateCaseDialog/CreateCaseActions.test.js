import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build";
import { Provider } from "react-redux";
import React from "react";
import { CreateCaseActions } from "./CreateCaseActions";
import {
  CIVILIAN_INITIATED,
  DESCENDING,
  ISO_DATE,
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
import { addressMustBeValid } from "../../../formValidations";
import {
  updateAddressInputValidity,
  updateSort
} from "../../actionCreators/casesActionCreators";
import normalizeAddress from "../../utilities/normalizeAddress";

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
    store.dispatch(updateSort(SORT_CASES_BY.CASE_REFERENCE, DESCENDING));

    dispatchSpy = jest.spyOn(store, "dispatch");

    dialog = mount(
      <Provider store={store}>
        <CreateCaseButton />
      </Provider>
    );

    dispatchSpy.mockClear();

    const createCaseButton = dialog.find(
      'button[data-testid="createCaseButton"]'
    );
    createCaseButton.simulate("click");

    store.dispatch(
      getIntakeSourcesSuccess([
        ["NOIPM Website", 1],
        ["Email", 2]
      ])
    );

    caseDetails = {
      case: {
        complaintType: CIVILIAN_INITIATED,
        firstContactDate: moment(Date.now()).format(ISO_DATE),
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
      '[data-testid="firstNameInput"]',
      caseDetails.civilian.firstName
    );
    changeInput(
      dialog,
      '[data-testid="lastNameInput"]',
      caseDetails.civilian.lastName
    );
    changeInput(
      dialog,
      '[data-testid="phoneNumberInput"]',
      caseDetails.civilian.phoneNumber
    );
    selectDropdownOption(
      dialog,
      '[data-testid="intakeSourceDropdown"]',
      "NOIPM Website"
    );
  });

  describe("creating a case", () => {
    let addressSuggestionField, submitButton;

    beforeEach(() => {
      addressSuggestionField = dialog.find(
        'input[data-testid="addressSuggestionField"]'
      );
      submitButton = dialog.find('LinkButton[data-testid="createCaseOnly"]');
    });
    test("should create a case with address", async () => {
      changeInput(
        dialog,
        '[data-testid="addressSuggestionField"]',
        caseDetails.civilian.address.streetAddress
      );
      addressSuggestionField.simulate("blur");

      const fillAddressToConfirmButton = dialog
        .find('[data-testid="fillAddressToConfirm"]')
        .last();
      changeInput(
        dialog,
        '[data-testid="streetAddress2Input"]',
        caseDetails.civilian.address.streetAddress2
      );
      await expectEventuallyToExist(
        dialog,
        '[data-testid="fillAddressToConfirm"]'
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
          '[data-testid="addressSuggestionField"]',
          caseDetails.civilian.address.streetAddress
        );
        addressSuggestionField.simulate("blur");

        const fillAddressToConfirmButton = dialog
          .find('[data-testid="fillAddressToConfirm"]')
          .last();
        changeInput(
          dialog,
          '[data-testid="streetAddress2Input"]',
          caseDetails.civilian.address.streetAddress2
        );
        await expectEventuallyToExist(
          dialog,
          '[data-testid="fillAddressToConfirm"]'
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
          errors.autoSuggestValue = "Some Error Message";
          return errors;
        });
        changeInput(
          dialog,
          '[data-testid="addressSuggestionField"]',
          caseDetails.civilian.address.streetAddress
        );
        addressSuggestionField.simulate("blur");

        const fillAddressToConfirmButton = dialog
          .find('[data-testid="fillAddressToConfirm"]')
          .last();
        changeInput(
          dialog,
          '[data-testid="streetAddress2Input"]',
          caseDetails.civilian.address.streetAddress2
        );
        await expectEventuallyToExist(
          dialog,
          '[data-testid="fillAddressToConfirm"]'
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
          '[data-testid="addressSuggestionField"]',
          caseDetails.civilian.address.streetAddress
        );
        addressSuggestionField.simulate("blur");

        const fillAddressToConfirmButton = dialog
          .find('[data-testid="fillAddressToConfirm"]')
          .last();
        changeInput(
          dialog,
          '[data-testid="streetAddress2Input"]',
          caseDetails.civilian.address.streetAddress2
        );
        await expectEventuallyToExist(
          dialog,
          '[data-testid="fillAddressToConfirm"]'
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

      test("should remove address and name when choosing unknown", async () => {
        changeInput(
          dialog,
          '[data-testid="addressSuggestionField"]',
          caseDetails.civilian.address.streetAddress
        );
        addressSuggestionField.simulate("blur");

        const fillAddressToConfirmButton = dialog
          .find('[data-testid="fillAddressToConfirm"]')
          .last();
        changeInput(
          dialog,
          '[data-testid="streetAddress2Input"]',
          caseDetails.civilian.address.streetAddress2
        );
        await expectEventuallyToExist(
          dialog,
          '[data-testid="fillAddressToConfirm"]'
        );
        fillAddressToConfirmButton.simulate("click");

        changeInput(dialog, '[name="civilian.isUnknown"]', true);
        submitButton.simulate("click");

        expect(dispatchSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            creationDetails: expect.objectContaining({
              caseDetails: expect.objectContaining({
                civilian: {
                  isAnonymous: true,
                  isUnknown: true
                }
              })
            })
          })
        );
      });
    });
  });
});
