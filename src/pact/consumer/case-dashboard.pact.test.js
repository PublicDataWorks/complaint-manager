import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import CaseDashboard from "../../client/policeDataManager/cases/CaseDashboard";
import {
  GET_FEATURES_SUCCEEDED,
  GET_PERSON_TYPES,
  SHOW_FORM,
  USER_PERMISSIONS
} from "../../sharedUtilities/constants";

jest.mock(
  "../../client/policeDataManager/cases/CaseDetails/PersonOnCaseDialog/MapServices/MapService",
  () => {
    return jest.fn().mockImplementation(() => ({
      healthCheck: callback => {
        callback({ googleAddressServiceIsAvailable: false });
      }
    }));
  }
);

const typeWithFormKey = "OTHER";

const withKnownComplainant = {
  description: "Create case with known complainant using form",
  test: provider => async () => {
    await provider.addInteraction({
      state: "intake sources exist: complaint types exist",
      uponReceiving: "create case with known civilian complainant",
      withRequest: {
        method: "POST",
        path: "/api/cases",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          case: {
            complainantType: typeWithFormKey,
            firstContactDate: like("2022-11-17"),
            intakeSourceId: 1,
            complaintType: "Civilian Initiated"
          },
          civilian: {
            firstName: "Jane",
            lastName: "Doe",
            phoneNumber: "2221231234"
          }
        }
      },
      willRespondWith: {
        status: 201,
        body: like({
          primaryComplainant: {
            fullName: "Jane Doe",
            roleOnCase: "Complainant",
            isAnonymous: false,
            id: 4127,
            firstName: "Jane",
            lastName: "Doe",
            phoneNumber: "2221231234",
            caseId: 4174
          },
          caseReferencePrefix: "CC",
          caseReference: "CC2022-0532",
          statusId: 1,
          id: 4174,
          firstContactDate: "2022-11-17",
          intakeSourceId: 1,
          complaintType: "Civilian Initiated",
          complainantCivilians: [
            {
              fullName: "Jane Doe",
              roleOnCase: "Complainant",
              isAnonymous: false,
              id: 4127,
              firstName: "Jane",
              lastName: "Doe",
              phoneNumber: "2221231234",
              caseId: 4174
            }
          ],
          createdBy: "abc@def.ghi",
          assignedTo: "abc@def.ghi",
          year: 2022,
          caseNumber: 532,
          status: "Initial",
          nextStatus: "Active"
        })
      }
    });

    userEvent.click(await screen.findByTestId("intakeSourceInput"));
    userEvent.click(screen.getByText("Facebook"));
    userEvent.click(screen.getByTestId("complaintTypeDropdown"));
    userEvent.click(screen.getByText("Civilian Initiated"));

    const label = "not an officer";

    userEvent.click(screen.getByLabelText(label));

    userEvent.type(screen.getByTestId("firstNameInput"), "Jane");
    userEvent.type(screen.getByTestId("lastNameInput"), "Doe");
    userEvent.type(screen.getByTestId("phoneNumberInput"), "2221231234");
    userEvent.click(screen.getByTestId("createAndView"));
    expect(
      await screen.findByText("Case was successfully created")
    ).toBeInTheDocument();
  }
};

const withUnknownCivilianComplainant = {
  description: "Create case with unknown civilian complainant",
  test: provider => async () => {
    await provider.addInteraction({
      state: "intake sources exist: complaint types exist",
      uponReceiving: "create case with unknown civilian complainant",
      withRequest: {
        method: "POST",
        path: "/api/cases",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          case: {
            complainantType: typeWithFormKey,
            firstContactDate: like("2022-11-18"),
            intakeSourceId: 1,
            complaintType: "Civilian Initiated"
          },
          civilian: { isAnonymous: true, isUnknown: true }
        }
      },
      willRespondWith: {
        status: 201,
        body: like({
          primaryComplainant: {
            fullName: "",
            roleOnCase: "Complainant",
            id: 4130,
            isAnonymous: true,
            caseId: 4177,
            updatedAt: "2022-11-18T17:13:10.589Z",
            createdAt: "2022-11-18T17:13:10.589Z",
            firstName: "",
            lastName: ""
          },
          caseReferencePrefix: "AC",
          caseReference: "AC2022-0534",
          statusId: 1,
          id: 4177,
          firstContactDate: "2022-11-18",
          intakeSourceId: 3,
          complaintType: "Civilian Initiated",
          complainantCivilians: [
            {
              fullName: "",
              roleOnCase: "Complainant",
              id: 4130,
              isAnonymous: true,
              caseId: 4177,
              updatedAt: "2022-11-18T17:13:10.589Z",
              createdAt: "2022-11-18T17:13:10.589Z",
              firstName: "",
              lastName: ""
            }
          ],
          createdBy: "abc@def.ghi",
          assignedTo: "abc@def.ghi",
          year: 2022,
          caseNumber: 534,
          status: "Initial",
          nextStatus: "Active"
        })
      }
    });

    userEvent.click(await screen.findByTestId("intakeSourceInput"));
    userEvent.click(screen.getByText("Facebook"));
    userEvent.click(screen.getByTestId("complaintTypeDropdown"));
    userEvent.click(screen.getByText("Civilian Initiated"));

    const label = "not an officer";
    userEvent.click(screen.getByLabelText(label));

    userEvent.click(screen.getByLabelText("Unknown"));
    userEvent.click(screen.getByTestId("createAndView"));
    expect(
      await screen.findByText("Case was successfully created")
    ).toBeInTheDocument();
  }
};

const withComplainanTypeBeingDisplayed = {
  description: "create case with complainant type that does not show form",
  test: provider => async () => {
    const type = "OFFICER";
    await provider.addInteraction({
      state: "intake sources exist: complaint types exist",
      uponReceiving: "create case with officer complainant",
      withRequest: {
        method: "POST",
        path: "/api/cases",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          case: {
            complainantType: type,
            firstContactDate: like("2022-11-18"),
            intakeSourceId: 1,
            complaintType: "Civilian Initiated"
          }
        }
      },
      willRespondWith: {
        status: 201,
        body: like({
          caseReferencePrefix: "CC",
          caseReference: "CC2022-0535",
          statusId: 1,
          id: 4178,
          firstContactDate: "2022-11-18",
          intakeSourceId: 1,
          complaintType: "Civilian Initiated",
          createdBy: "abc@def.ghi",
          assignedTo: "abc@def.ghi",
          year: 2022,
          caseNumber: 535,
          status: "Initial",
          nextStatus: "Active"
        })
      }
    });

    userEvent.click(await screen.findByTestId("intakeSourceInput"));
    userEvent.click(screen.getByText("Facebook"));
    userEvent.click(screen.getByTestId("complaintTypeDropdown"));
    userEvent.click(screen.getByText("Civilian Initiated"));

    const label = "Police Officer";
    userEvent.click(screen.getByLabelText(label));

    userEvent.click(screen.getByTestId("createAndSearch"));
    expect(
      await screen.findByText("Case was successfully created")
    ).toBeInTheDocument();
  }
};

describe("Case dashboard", () => {
  const scenarios = [
    withKnownComplainant,
    withUnknownCivilianComplainant,
    withComplainanTypeBeingDisplayed
  ];
  scenarios.forEach(scenario => {
    pactWith(
      {
        consumer: "complaint-manager.client",
        provider: "complaint-manager.server",
        logLevel: "ERROR",
        timeout: 3000
      },
      provider => {
        beforeAll(async () => {
          axios.defaults.baseURL = provider.mockService.baseUrl;
          await Promise.all([
            provider.addInteraction({
              state: "intake sources exist",
              uponReceiving: "get intake sources",
              withRequest: {
                method: "GET",
                path: "/api/intake-sources"
              },
              willRespondWith: {
                status: 200,
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                },
                body: eachLike(["Facebook", 1])
              }
            }),
            provider.addInteraction({
              state: "complaint types exist",
              uponReceiving: "get complaint types",
              withRequest: {
                method: "GET",
                path: "/api/complaint-types"
              },
              willRespondWith: {
                status: 200,
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                },
                body: eachLike({ name: "Civilian Initiated" })
              }
            }),
            provider.addInteraction({
              state: "priority levels exist",
              uponReceiving: "get priority levels",
              withRequest: {
                method: "GET",
                path: "/api/priority-levels"
              },
              willRespondWith: {
                status: 200,
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                },
                body: eachLike(["priority-level-test", 1])
              }
            }),
            provider.addInteraction({
              state: "priority reasons exist",
              uponReceiving: "get priority reasons",
              withRequest: {
                method: "GET",
                path: "/api/priority-reasons"
              },
              willRespondWith: {
                status: 200,
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                },
                body: eachLike({ name: "priority-reason-test", id: 1 })
              }
            }),
            provider.addInteraction({
              state: "Case exists: with civilian complainant",
              uponReceiving: "get cases page 1",
              withRequest: {
                method: "GET",
                path: "/api/cases",
                query: { page: "1" }
              },
              willRespondWith: {
                status: 200,
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                },
                body: like({
                  cases: {
                    count: 1254,
                    rows: eachLike({
                      primaryComplainant: {
                        personType: "Civilian",
                        fullName: "",
                        isAnonymous: true
                      },
                      accusedOfficers: [],
                      caseReference: "AC2022-0515",
                      tagNames: [null],
                      id: 4152,
                      complaintType: "Rank Initiated",
                      status: "Ready for Review",
                      year: 2022,
                      caseNumber: 515,
                      firstContactDate: "2022-11-08",
                      assignedTo: "isabel.olson@thoughtworks.com",
                      complainantPersonType: "Civilian",
                      complainantFirstName: "",
                      complainantLastName: "",
                      complainantIsAnonymous: true
                    })
                  }
                })
              }
            }),
            provider.addInteraction({
              uponReceiving: "get complaint totals",
              withRequest: {
                method: "GET",
                path: "/api/data",
                query: { queryType: "countComplaintTotals" }
              },
              willRespondWith: {
                status: 200,
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                },
                body: like({ ytd: 53, previousYear: 124 })
              }
            })
          ]);

          let store = createConfiguredStore();
          store.dispatch({
            type: "AUTH_SUCCESS",
            userInfo: { permissions: [USER_PERMISSIONS.CREATE_CASE] }
          });

          store.dispatch({
            type: GET_FEATURES_SUCCEEDED,
            features: { chooseComplaintType: true }
          });

          store.dispatch({
            type: GET_PERSON_TYPES,
            payload: [
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
            ]
          });

          render(
            <Provider store={store}>
              <Router>
                <CaseDashboard />
                <SharedSnackbarContainer />
              </Router>
            </Provider>
          );

          await screen.findByTestId("createCaseButton");

          userEvent.click(await screen.findByTestId("createCaseButton"));
        });

        test(scenario.description, scenario.test(provider));
      }
    );
  });
});
