import React from "react";
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
  USER_PERMISSIONS
} from "../../sharedUtilities/constants";

jest.mock(
  "../../client/policeDataManager/cases/CaseDetails/CivilianDialog/MapServices/MapService",
  () => {
    return jest.fn().mockImplementation(() => ({
      healthCheck: callback => {
        callback({ googleAddressServiceIsAvailable: false });
      }
    }));
  }
);

pactWith(
  {
    consumer: "complaint-manager.client",
    provider: "complaint-manager.server",
    logLevel: "ERROR",
    timeout: 500000
  },
  provider => {
    beforeAll(async () => {
      axios.defaults.baseURL = provider.mockService.baseUrl;
    });

    describe("case dashboard", () => {
      beforeEach(async () => {
        await provider.addInteraction({
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
        });

        await provider.addInteraction({
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
        });

        await provider.addInteraction({
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
        });

        await provider.addInteraction({
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
        });

        let store = createConfiguredStore();
        store.dispatch({
          type: "AUTH_SUCCESS",
          userInfo: { permissions: [USER_PERMISSIONS.CREATE_CASE] }
        });

        store.dispatch({
          type: GET_FEATURES_SUCCEEDED,
          features: { chooseComplaintType: true }
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
      });

      describe("Create case", () => {
        let intakeSourceDropdown;

        beforeEach(async () => {
          userEvent.click(await screen.findByTestId("createCaseButton"));
          intakeSourceDropdown = await screen.findByTestId("intakeSourceInput");
        });

        test("Create case with known civilian complainant", async () => {
          await provider.addInteraction({
            state: "intake sources exist: complaint types exist",
            uponReceiving: "create case",
            withRequest: {
              method: "POST",
              path: "/api/cases",
              headers: {
                "Content-Type": "application/json"
              },
              body: {
                case: {
                  complainantType: "Civilian Initiated",
                  firstContactDate: "2022-11-17",
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
                createdBy: "claire.holt@thoughtworks.com",
                assignedTo: "claire.holt@thoughtworks.com",
                year: 2022,
                caseNumber: 532,
                status: "Initial",
                nextStatus: "Active"
              })
            }
          });

          userEvent.click(intakeSourceDropdown);
          userEvent.click(await screen.findByText("Facebook"));
          userEvent.click(screen.getByTestId("complaintTypeDropdown"));
          userEvent.click(await screen.findByText("Civilian Initiated"));
          userEvent.type(screen.getByTestId("firstNameInput"), "Jane");
          userEvent.type(screen.getByTestId("lastNameInput"), "Doe");
          userEvent.type(screen.getByTestId("phoneNumberInput"), "2221231234");
          userEvent.click(screen.getByTestId("createAndView"));
        });

        test.todo("Create case with unknown civilian complainant");
        test.todo("Create case with officer complainant");
      });
    });
  }
);
