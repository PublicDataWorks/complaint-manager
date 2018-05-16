import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { createCaseSuccess } from "../../actionCreators/casesActionCreators";
import CreateCaseDialog from "./CreateCaseDialog";
import { changeInput, expectEventuallyNotToExist } from "../../../testHelpers";
import createCase from "../thunks/createCase";
import { openSnackbar } from "../../actionCreators/snackBarActionCreators";
import moment from "moment";
import { userAuthSuccess } from "../../auth/actionCreators";
import { applyCentralTimeZoneOffset } from "../../utilities/formatDate";

jest.mock("../thunks/createCase", () => creationDetails => ({
  type: "MOCK_CREATE_CASE_THUNK",
  creationDetails
}));

describe("CreateCaseDialog component", () => {
  let store,
    dialog,
    dispatchSpy,
    testUsername,
    dateAndTimeToday,
    dateAndTimeTodayWithTimezone;

  beforeEach(() => {
    store = createConfiguredStore();
    dateAndTimeToday = moment(Date.now()).format("YYYY-MM-DDTHH:mm");
    dateAndTimeTodayWithTimezone = applyCentralTimeZoneOffset(dateAndTimeToday);

    testUsername = "tuser";
    store.dispatch(userAuthSuccess({ nickname: testUsername }));

    dispatchSpy = jest.spyOn(store, "dispatch");

    dialog = mount(
      <Provider store={store}>
        <CreateCaseDialog />
      </Provider>
    );

    dispatchSpy.mockClear();

    const createCaseButton = dialog.find(
      'button[data-test="createCaseButton"]'
    );
    createCaseButton.simulate("click");
  });

  test("should dismiss visible snackbars when dialog opened", () => {
    store.dispatch(openSnackbar());
    const createCaseButton = dialog.find(
      'button[data-test="createCaseButton"]'
    );

    createCaseButton.simulate("click");

    expect(store.getState()).toHaveProperty("ui.snackbar.open", false);
  });

  describe("submitting a case", () => {
    let caseDetails;

    beforeEach(() => {
      caseDetails = {
        case: {
          complainantType: "Civilian",
          firstContactDate: moment(Date.now()).format("YYYY-MM-DD"),
          createdBy: testUsername,
          assignedTo: testUsername
        },
        civilian: {
          firstName: "Fats",
          lastName: "Domino",
          phoneNumber: "0123456789",
          email: "fdomino@gmail.com"
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
      changeInput(
        dialog,
        '[data-test="emailInput"]',
        caseDetails.civilian.email
      );
    });

    test("should plan to redirect when clicking Create-And-View", () => {
      const submitButton = dialog.find(
        'PrimaryButton[data-test="createAndView"]'
      );
      submitButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        createCase({ caseDetails: caseDetails, redirect: true })
      );
    });

    test("should create case when clicking Create Only", () => {
      const submitButton = dialog.find(
        'LinkButton[data-test="createCaseOnly"]'
      );
      submitButton.simulate("click");
      expect(dispatchSpy).toHaveBeenCalledWith(
        createCase({ caseDetails: caseDetails, redirect: false })
      );
    });
  });

  describe("dismissing dialog", () => {
    test("should dismiss when cancel button is clicked", async () => {
      const cancel = dialog.find('button[data-test="cancelCase"]');
      cancel.simulate("click");

      await expectEventuallyNotToExist(
        dialog,
        '[data-test="createCaseDialogTitle"]'
      );
    });

    test("should dismiss after successful case creation", async () => {
      store.dispatch(createCaseSuccess({ id: 1234 }));

      await expectEventuallyNotToExist(
        dialog,
        '[data-test="createCaseDialogTitle"]'
      );
    });
  });

  describe("fields", () => {
    describe("firstContactDatePicker", () => {
      test("should default date to current date", () => {
        const datePicker = dialog
          .find('[data-test="firstContactDateInput"]')
          .last();
        expect(datePicker.instance().value).toEqual(
          moment(Date.now()).format("YYYY-MM-DD")
        );
      });
    });
  });

  describe("field validation", () => {
    let submitButton;
    beforeEach(() => {
      submitButton = dialog.find('LinkButton[data-test="createCaseOnly"]');
    });

    describe("first name", () => {
      test("should display error message on submit when no value", () => {
        const firstNameField = dialog.find('div[data-test="firstNameField"]');
        submitButton.simulate("click");
        expect(firstNameField.text()).toContain("Please enter First Name");
      });

      test("should display error message when no value and clicked on and off", () => {
        const firstNameField = dialog.find('div[data-test="firstNameField"]');
        const firstNameInput = dialog.find('input[data-test="firstNameInput"]');
        firstNameInput.simulate("focus");
        firstNameInput.simulate("blur");
        expect(firstNameField.text()).toContain("Please enter First Name");
      });

      test("should display error when whitespace", () => {
        const firstNameInput = dialog.find('input[data-test="firstNameInput"]');

        firstNameInput.simulate("focus");
        firstNameInput.simulate("change", { target: { value: "   " } });
        firstNameInput.simulate("blur");

        const firstNameField = dialog.find('div[data-test="firstNameField"]');
        expect(firstNameField.text()).toContain("Please enter First Name");
      });
    });

    describe("last name", () => {
      test("should display error message when no value", () => {
        const lastNameField = dialog.find('div[data-test="lastNameField"]');
        submitButton.simulate("click");
        expect(lastNameField.text()).toContain("Please enter Last Name");
      });

      test("should display error message when no value and clicked on and off", () => {
        const lastNameField = dialog.find('div[data-test="lastNameField"]');
        const lastNameInput = dialog.find('input[data-test="lastNameInput"]');
        lastNameInput.simulate("focus");
        lastNameInput.simulate("blur");
        expect(lastNameField.text()).toContain("Please enter Last Name");
      });

      test("should display error when whitespace", () => {
        const lastNameInput = dialog.find('input[data-test="lastNameInput"]');

        lastNameInput.simulate("focus");
        lastNameInput.simulate("change", { target: { value: "\t\t   " } });
        lastNameInput.simulate("blur");

        const lastNameField = dialog.find('div[data-test="lastNameField"]');
        expect(lastNameField.text()).toContain("Please enter Last Name");
      });
    });

    describe("phone number", () => {
      test("should not display error when nothing was entered (Will prompt for email or phone number instead)", () => {
        submitButton.simulate("click");

        const phoneNumberField = dialog.find(
          'div[data-test="phoneNumberField"]'
        );
        expect(phoneNumberField.text()).not.toContain(
          "Please enter a numeric 10 digit value"
        );
      });
    });

    describe("when email and phone number are undefined", () => {
      test("should display phone number error", () => {
        submitButton.simulate("click");

        const phoneNumberField = dialog.find(
          'div[data-test="phoneNumberField"]'
        );
        const emailField = dialog.find('div[data-test="emailField"]');

        expect(phoneNumberField.text()).toContain(
          "Please enter phone number or email address"
        );
        expect(emailField.text()).toContain(
          "Please enter phone number or email address"
        );
      });
    });
  });

  describe("trimming whitespace", () => {
    test("whitespace should be trimmed from fields prior to sending", () => {
      const caseDetails = {
        case: {
          complainantType: "Civilian",
          firstContactDate: moment(Date.now()).format("YYYY-MM-DD"),
          createdBy: testUsername,
          assignedTo: testUsername
        },
        civilian: {
          firstName: "Hello",
          lastName: "Kitty",
          phoneNumber: "1234567890"
        }
      };

      changeInput(dialog, 'input[data-test="firstNameInput"]', "   Hello   ");
      changeInput(dialog, 'input[data-test="lastNameInput"]', "   Kitty   ");
      changeInput(dialog, 'input[data-test="phoneNumberInput"]', "1234567890");

      const submitButton = dialog.find(
        'LinkButton[data-test="createCaseOnly"]'
      );
      submitButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        createCase({ caseDetails: caseDetails, redirect: false })
      );
    });
  });
});
