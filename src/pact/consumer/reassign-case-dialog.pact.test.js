import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import RecommendedActions from "../../client/policeDataManager/cases/ReferralLetter/RecommendedActions/RecommendedActions";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import ReassignCaseDialog from "../../client/policeDataManager/cases/CaseDetails/ReassignCaseDialog/ReassignCaseDialog";

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

    describe("Reassign Case Dialog", () => {
      let caseDetails;
      beforeEach(async () => {
        caseDetails = {
          id: 1,
          caseReference: "CC2022-0003",
          status: "Active",
          assignedTo: like("anna.banana@gmail.com"),
          complainantCivilians: [],
          complainantOfficers: [],
          accusedOfficers: [],
          witnessCivilians: [],
          witnessOfficers: []
        };
        await provider.addInteraction({
          state: "Case Exists",
          uponReceiving: "get case details",
          withRequest: {
            method: "GET",
            path: "/api/cases/1"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like(caseDetails)
          }
        });
      });

      test("should reassign assignedTo", async () => {
        await provider.addInteraction({
          state: "Case Exists;",
          uponReceiving: "Update Assigned To",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              id: 1,
              caseReference: "CC2022-0003",
              status: "Active",
              assignedTo: "soybeans@gmail.com",
              complainantCivilians: [],
              complainantOfficers: [],
              accusedOfficers: [],
              witnessCivilians: [],
              witnessOfficers: []
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        render(
          <Provider store={createConfiguredStore()}>
            <Router>
              <ReassignCaseDialog
                caseDetail={caseDetails}
                open={true}
              ></ReassignCaseDialog>
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        userEvent.click(
          await screen.findByTestId("include-retaliation-concerns-field")
        );
        userEvent.click(screen.getByTestId("userDropdownInput"));
        const newAssignee = await screen.findByText(FAKE_USERS[1].email);
        userEvent.click(newAssignee);
        userEvent.click(screen.getByTestId("assignedToSubmitButton"));

        const snackbar = await screen.findByTestId("sharedSnackbarBannerText");
        expect(snackbar.textContent).toInclude("successfully updated");
      });

      test("should submit with multiple classifications and recommended actions", async () => {
        await provider.addInteraction({
          state: "letter is ready for review: officer history added",
          uponReceiving: "update multiple classifications",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/classifications",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              id: 1,
              classifications: [1, null, 3, null]
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        await provider.addInteraction({
          state: "letter is ready for review: officer history added",
          uponReceiving: "update multiple recommended actions",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/recommended-actions",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              id: 1,
              "csfn-1": true,
              "csfn-3": true,
              letterOfficers: [
                {
                  "action-1": true,
                  "action-5": true,
                  caseOfficerId: 1,
                  fullName: "Alexane C Barrows",
                  id: 1,
                  officerHistoryOptionId: "2",
                  referralLetterOfficerRecommendedActions: [1, 5],
                  referralLetterOfficerHistoryNotes: [
                    {
                      tempId: "oTJmUKFZbygoVA-hTYocZ"
                    }
                  ]
                }
              ]
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        render(
          <Provider store={createConfiguredStore()}>
            <Router>
              <RecommendedActions match={{ params: { id: "1" } }} />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        userEvent.click(await screen.findByTestId("use-of-force"));
        userEvent.click(screen.getByTestId("serious-misconduct"));
        userEvent.click(await screen.findByTestId("letterOfficers[0]-1"));
        userEvent.click(screen.getByTestId("letterOfficers[0]-5"));
        userEvent.click(screen.getByTestId("next-button"));

        const snackbar = await screen.findByTestId("sharedSnackbarBannerText");
        expect(snackbar.textContent).toInclude("successfully updated");
      });
    });
  }
);
