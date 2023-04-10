import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import {
  changeInput,
  expectEventuallyNotToExist,
  expectEventuallyToExist,
  selectDropdownOption
} from "../../../testHelpers";
import CreateCaseButton from "../CreateCaseButton";
import createCase from "../thunks/createCase";
import { openSnackbar } from "../../actionCreators/snackBarActionCreators";
import moment from "moment";
import {
  CIVILIAN_INITIATED,
  CONFIGS,
  DESCENDING,
  GET_CONFIGS_SUCCEEDED,
  GET_PERSON_TYPES,
  ISO_DATE,
  NUMBER_OF_COMPLAINANT_TYPES_BEFORE_SWITCHING_TO_DROPDOWN,
  RANK_INITIATED,
  SHOW_FORM,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import { getIntakeSourcesSuccess } from "../../actionCreators/intakeSourceActionCreators";
import { updateSort } from "../../actionCreators/casesActionCreators";

const {
  CIVILIAN_WITHIN_PD_INITIATED,
  PD
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

jest.mock("../CaseDetails/PersonOnCaseDialog/MapServices/MapService");

jest.mock("../thunks/createCase", () => creationDetails => ({
  type: "MOCK_CREATE_CASE_THUNK",
  creationDetails
}));

jest.mock("../../intakeSources/thunks/getIntakeSourceDropdownValues", () =>
  jest.fn(values => ({
    type: "MOCK_THUNK",
    values
  }))
);

describe("CreateCaseDialog component", () => {
  let store, dialog, dispatchSpy, dateAndTimeToday;

  const personTypes = [
    {
      key: "OFFICER",
      description: "Officer",
      employeeDescription: "Officer",
      isEmployee: true,
      abbreviation: "O",
      legend: "Officer (O)",
      dialogAction: "/redirect",
      isDefault: false
    },
    {
      key: "OTHER",
      description: "not an officer",
      abbreviation: "OTH",
      legend: "not an officer (OTH)",
      dialogAction: SHOW_FORM,
      isDefault: true,
      subTypes: ["Other1", "Other2", "Other3"]
    }
  ];

  beforeEach(() => {
    console.warn = () => {};
    store = createConfiguredStore();
    dateAndTimeToday = moment(Date.now()).format("YYYY-MM-DDTHH:mm");
    store.dispatch(updateSort(SORT_CASES_BY.CASE_REFERENCE, DESCENDING));
    store.dispatch({
      type: GET_CONFIGS_SUCCEEDED,
      payload: { [CONFIGS.PD]: PD }
    });

    store.dispatch({
      type: GET_PERSON_TYPES,
      payload: personTypes
    });

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
  });

  test("should dismiss visible snackbars when dialog opened", () => {
    store.dispatch(openSnackbar());
    const createCaseButton = dialog.find(
      'button[data-testid="createCaseButton"]'
    );

    createCaseButton.simulate("click");

    expect(store.getState()).toHaveProperty("ui.snackbar.open", false);
  });

  describe("dismissing dialog", () => {
    test("should dismiss when cancel button is clicked", async () => {
      const cancel = dialog.find('button[data-testid="cancelCase"]');
      cancel.simulate("click");

      await expectEventuallyNotToExist(
        dialog,
        '[data-testid="createCaseDialogTitle"]'
      );
    });
  });

  personTypes.forEach(type => {
    describe(type.description, () => {
      beforeEach(() => {
        const selector = `label[data-testid="${(type.isEmployee
          ? type.employeeDescription
          : type.description
        )
          .toLowerCase()
          .replaceAll(" ", "-")}-radio-button"]`;
        dialog.find(selector).simulate("click");

        if (type.subTypes) {
          selectDropdownOption(
            dialog,
            `[data-testid="personSubtypeDropdown-autocomplete"]`,
            type.subTypes[0]
          );
        }
      });

      if (type.dialogAction === SHOW_FORM) {
        describe("submitting a case", () => {
          let caseDetails;

          beforeEach(() => {
            let complaintType;
            if (type.key === "CIVILIAN") {
              complaintType = CIVILIAN_INITIATED;
            } else if (type.key.includes("OFFICER")) {
              complaintType = RANK_INITIATED;
            } else if (type.key.includes("CIVILIAN")) {
              complaintType = CIVILIAN_WITHIN_PD_INITIATED;
            }

            caseDetails = {
              case: {
                complainantType: type.key,
                complaintType: "Civilian Initiated",
                firstContactDate: moment(Date.now()).format(ISO_DATE),
                intakeSourceId: 1,
                complaintType
              },
              civilian: {
                firstName: "Fats",
                lastName: "Domino",
                phoneNumber: "0123456789",
                email: "fdomino@gmail.com"
              }
            };

            if (type.subTypes) {
              caseDetails.civilian.personSubType = type.subTypes[0];
            }

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
            changeInput(
              dialog,
              '[data-testid="emailInput"]',
              caseDetails.civilian.email
            );
            selectDropdownOption(
              dialog,
              '[data-testid="intakeSourceDropdown"]',
              "NOIPM Website"
            );
          });

          test("should plan to redirect when clicking Create-And-View", () => {
            const submitButton = dialog.find(
              'PrimaryButton[data-testid="createAndView"]'
            );
            submitButton.simulate("click");

            expect(
              dispatchSpy.mock.calls.find(
                call => call[0].type === "MOCK_CREATE_CASE_THUNK"
              )[0]
            ).toEqual(
              createCase({
                caseDetails: {
                  ...caseDetails,
                  case: {
                    ...caseDetails.case,
                    complaintType: CIVILIAN_INITIATED
                  }
                },
                personType: personTypes[1],
                redirect: true,
                sorting: {
                  sortBy: SORT_CASES_BY.CASE_REFERENCE,
                  sortDirection: DESCENDING
                },
                pagination: {
                  currentPage: 1
                }
              })
            );
          });

          test("should create case when clicking Create Only", () => {
            const submitButton = dialog.find(
              'LinkButton[data-testid="createCaseOnly"]'
            );
            submitButton.simulate("click");

            expect(
              dispatchSpy.mock.calls.find(
                call => call[0].type === "MOCK_CREATE_CASE_THUNK"
              )[0]
            ).toEqual(
              createCase({
                caseDetails: {
                  ...caseDetails,
                  case: {
                    ...caseDetails.case,
                    complaintType: CIVILIAN_INITIATED
                  }
                },
                personType: personTypes[1],
                redirect: false,
                sorting: {
                  sortBy: SORT_CASES_BY.CASE_REFERENCE,
                  sortDirection: DESCENDING
                },
                pagination: {
                  currentPage: 1
                }
              })
            );
          });
        });

        describe("fields", () => {
          describe("firstContactDatePicker", () => {
            test("should default date to current date", () => {
              const datePicker = dialog
                .find('[data-testid="firstContactDateInput"]')
                .last();
              expect(datePicker.instance().value).toEqual(
                moment(Date.now()).format(ISO_DATE)
              );
            });

            test("should show form to fill in complainant info", () => {
              expect(
                dialog.find('[data-testid="firstNameField"]').exists()
              ).toBeTruthy();
              expect(
                dialog.find('[data-testid="createAndView"]').exists()
              ).toBeTruthy();
              expect(
                dialog.find('[data-testid="createCaseOnly"]').exists()
              ).toBeTruthy();
            });
          });
        });

        describe("field validation", () => {
          let submitButton;
          beforeEach(() => {
            submitButton = dialog.find(
              'LinkButton[data-testid="createCaseOnly"]'
            );
          });

          describe("first name", () => {
            test("should display error message on submit when no value", () => {
              const firstNameField = dialog.find(
                'div[data-testid="firstNameField"]'
              );
              submitButton.simulate("click");
              expect(firstNameField.text()).toContain(
                "Please enter First Name"
              );
            });

            test("should display error message when no value and clicked on and off", () => {
              const firstNameField = dialog.find(
                'div[data-testid="firstNameField"]'
              );
              const firstNameInput = dialog.find(
                'input[data-testid="firstNameInput"]'
              );
              firstNameInput.simulate("focus");
              firstNameInput.simulate("blur");
              expect(firstNameField.text()).toContain(
                "Please enter First Name"
              );
            });

            test("should display error when whitespace", () => {
              const firstNameInput = dialog.find(
                'input[data-testid="firstNameInput"]'
              );

              firstNameInput.simulate("focus");
              firstNameInput.simulate("change", { target: { value: "   " } });
              firstNameInput.simulate("blur");

              const firstNameField = dialog.find(
                'div[data-testid="firstNameField"]'
              );
              expect(firstNameField.text()).toContain(
                "Please enter First Name"
              );
            });
          });

          describe("last name", () => {
            test("should display error message when no value", () => {
              const lastNameField = dialog.find(
                'div[data-testid="lastNameField"]'
              );
              submitButton.simulate("click");
              expect(lastNameField.text()).toContain("Please enter Last Name");
            });

            test("should display error message when no value and clicked on and off", () => {
              const lastNameField = dialog.find(
                'div[data-testid="lastNameField"]'
              );
              const lastNameInput = dialog.find(
                'input[data-testid="lastNameInput"]'
              );
              lastNameInput.simulate("focus");
              lastNameInput.simulate("blur");
              expect(lastNameField.text()).toContain("Please enter Last Name");
            });

            test("should display error when whitespace", () => {
              const lastNameInput = dialog.find(
                'input[data-testid="lastNameInput"]'
              );

              lastNameInput.simulate("focus");
              lastNameInput.simulate("change", {
                target: { value: "\t\t   " }
              });
              lastNameInput.simulate("blur");

              const lastNameField = dialog.find(
                'div[data-testid="lastNameField"]'
              );
              expect(lastNameField.text()).toContain("Please enter Last Name");
            });
          });

          describe("phone number", () => {
            test("should not display error when nothing was entered (Will prompt for email or phone number instead)", () => {
              submitButton.simulate("click");

              const phoneNumberField = dialog.find(
                'div[data-testid="phoneNumberField"]'
              );
              expect(phoneNumberField.text()).not.toContain(
                "Please enter a numeric 10 digit value"
              );
            });
          });

          describe("intake source", () => {
            test("should display error when not set on save", () => {
              const submitButton = dialog.find(
                'LinkButton[data-testid="createCaseOnly"]'
              );
              submitButton.simulate("click");
              expect(
                dialog
                  .find('[data-testid="intakeSourceDropdown"]')
                  .last()
                  .text()
              ).toContain("Please enter Intake Source");
            });
          });

          describe("contact information validation", () => {
            test("should display phone number error message when phone, address, and email are undefined", () => {
              changeInput(dialog, '[data-testid="lastNameInput"]', "test");
              changeInput(dialog, '[data-testid="firstNameInput"]', "test");
              selectDropdownOption(
                dialog,
                '[data-testid="intakeSourceDropdown"]',
                "Email"
              );
              const phoneNumberField = dialog.find(
                'div[data-testid="phoneNumberField"]'
              );
              const phoneNumberInput = dialog.find(
                'input[data-testid="phoneNumberInput"]'
              );
              phoneNumberInput.simulate("focus");
              phoneNumberInput.simulate("blur");
              submitButton.simulate("click");

              expect(phoneNumberField.text()).toContain(
                "Please enter one form of contact"
              );
            });
          });

          test("should submit new case when only address provided for contact info", async () => {
            const addressString = "200 E Randolph St, Chicago, IL, 60601, US";

            const addressObject = {
              city: "Chicago",
              country: "US",
              lat: 41.8855572,
              lng: -87.6214826,
              placeId: "ChIJObywJqYsDogR_4XaBVM4ge8",
              state: "IL",
              streetAddress: "200 E Randolph St",
              streetAddress2: "Ste 2500",
              zipCode: "60601"
            };

            const civilian = {
              firstName: "Henry",
              lastName: "Bubbler",
              address: addressObject
            };

            const caseDetails = {
              case: {
                complaintType: CIVILIAN_INITIATED,
                complainantType: type.key,
                firstContactDate: moment(Date.now()).format(ISO_DATE),
                intakeSourceId: 1,
                incidentDate: undefined
              },
              civilian: civilian
            };

            if (type.subTypes) {
              caseDetails.civilian.personSubType = type.subTypes[0];
            }

            changeInput(
              dialog,
              '[data-testid="lastNameInput"]',
              civilian.lastName
            );
            changeInput(
              dialog,
              '[data-testid="firstNameInput"]',
              civilian.firstName
            );
            selectDropdownOption(
              dialog,
              '[data-testid="intakeSourceDropdown"]',
              "NOIPM Website"
            );
            changeInput(
              dialog,
              '[data-testid="addressSuggestionField"]',
              addressString
            );
            dialog
              .find('input[data-testid="addressSuggestionField"]')
              .last()
              .simulate("blur");
            changeInput(
              dialog,
              '[data-testid="streetAddress2Input"]',
              addressObject.streetAddress2
            );
            await expectEventuallyToExist(
              dialog,
              '[data-testid="fillAddressToConfirm"]'
            );
            dialog
              .find('[data-testid="fillAddressToConfirm"]')
              .last()
              .simulate("click");

            const submitButton = dialog.find(
              'LinkButton[data-testid="createCaseOnly"]'
            );

            submitButton.simulate("click");

            expect(dispatchSpy).toHaveBeenCalledWith(
              createCase({
                caseDetails: caseDetails,
                personType: personTypes[1],
                redirect: false,
                sorting: {
                  sortBy: SORT_CASES_BY.CASE_REFERENCE,
                  sortDirection: DESCENDING
                },
                pagination: {
                  currentPage: 1
                }
              })
            );
          });
        });

        describe("trimming whitespace", () => {
          test("whitespace should be trimmed from fields prior to sending", () => {
            const caseDetails = {
              case: {
                complaintType: CIVILIAN_INITIATED,
                complainantType: type.key,
                firstContactDate: moment(Date.now()).format(ISO_DATE),
                intakeSourceId: 2,
                incidentDate: undefined
              },
              civilian: {
                firstName: "Hello",
                lastName: "Kitty",
                phoneNumber: "1234567890"
              }
            };

            if (type.subTypes) {
              caseDetails.civilian.personSubType = type.subTypes[0];
            }

            changeInput(
              dialog,
              'input[data-testid="firstNameInput"]',
              "   Hello   "
            );
            changeInput(
              dialog,
              'input[data-testid="lastNameInput"]',
              "   Kitty   "
            );
            changeInput(
              dialog,
              'input[data-testid="phoneNumberInput"]',
              "1234567890"
            );

            selectDropdownOption(
              dialog,
              '[data-testid="intakeSourceDropdown"]',
              "Email"
            );

            const submitButton = dialog.find(
              'LinkButton[data-testid="createCaseOnly"]'
            );
            submitButton.simulate("click");

            expect(
              dispatchSpy.mock.calls.find(
                call => call[0].type === "MOCK_CREATE_CASE_THUNK"
              )[0]
            ).toEqual(
              createCase({
                caseDetails: caseDetails,
                personType: personTypes[1],
                redirect: false,
                sorting: {
                  sortBy: SORT_CASES_BY.CASE_REFERENCE,
                  sortDirection: DESCENDING
                },
                pagination: {
                  currentPage: 1
                }
              })
            );
          });
        });
      } else {
        describe("no form", () => {
          test("should not see civilian details or civilian create buttons when officer selected", () => {
            expect(
              dialog.find('[data-testid="firstNameField"]').exists()
            ).toBeFalsy();
            expect(
              dialog.find('[data-testid="createAndView"]').exists()
            ).toBeFalsy();
            expect(
              dialog.find('[data-testid="createCaseOnly"]').exists()
            ).toBeFalsy();
            expect(
              dialog.find('[data-testid="intakeSourceDropdown"]').exists()
            ).toBeTruthy();
          });

          test("should see create and search button when officer complainant selected", () => {
            expect(
              dialog.find('[data-testid="createAndSearch"]').exists()
            ).toBeTruthy();
          });

          test("should dispatch createCase with redirect to add officer when create & search clicked", () => {
            selectDropdownOption(
              dialog,
              '[data-testid="intakeSourceDropdown"]',
              "Email"
            );
            const createAndSearch = dialog
              .find('[data-testid="createAndSearch"]')
              .last();
            createAndSearch.simulate("click");

            expect(
              dispatchSpy.mock.calls.find(
                call => call[0].type === "MOCK_CREATE_CASE_THUNK"
              )[0]
            ).toEqual({
              type: "MOCK_CREATE_CASE_THUNK",
              creationDetails: expect.objectContaining({
                redirect: true,
                caseDetails: expect.objectContaining({
                  case: expect.objectContaining({
                    complainantType: type.key.includes("OFFICER")
                      ? expect.stringContaining("OFFICER")
                      : type.key
                  })
                })
              })
            });
          });
        });
      }
    });
  });
});
