import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import LetterPreview from "../../client/policeDataManager/cases/ReferralLetter/LetterPreview/LetterPreview";
import { CASE_STATUS, USER_PERMISSIONS } from "../../sharedUtilities/constants";

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

    describe("letter preview page", () => {
      [
        {
          scenario: "complainants are missing",
          complainantCivilians: [],
          letterOfficers: [],
          classifications: {},
          errorDialogText: "Missing Complainant Information",
          previewState: "letter is ready for review",
          letterState: "letter is ready for review"
        },
        {
          scenario: "officer history is missing",
          complainantCivilians: [{ id: 1 }],
          letterOfficers: [],
          classifications: {},
          errorDialogText: "Missing Officer History",
          previewState: "letter is ready for review: with civilian complainant",
          letterState: "letter is ready for review"
        },
        {
          scenario: "classifications are missing",
          complainantCivilians: [{ id: 1 }],
          letterOfficers: [
            {
              id: 1,
              fullName: "Bad Policeman",
              officerHistoryOptionId: "3"
            }
          ],
          classifications: {},
          errorDialogText: "Missing Classifications",
          previewState: "letter is ready for review: with civilian complainant",
          letterState: "letter is ready for review: officer history added"
        }
      ].forEach(opts => {
        test(`should fail to submit when ${opts.scenario}`, async () => {
          await provider.addInteraction({
            state: opts.previewState,
            uponReceiving: "get letter preview",
            withRequest: {
              method: "GET",
              path: "/api/cases/1/referral-letter/preview"
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              },
              body: like({
                letterHtml:
                  "<div>Now is the winter of our discontent made glorious summer by this son of York</div>",
                addresses: {
                  recipient: "Deputy Superintendent Police Superintendent",
                  recipientAddress:
                    "Public Integrity Bureau\nNew Orleans Police Department\n1340 Poydras St Suite 1900\nNew Orleans, LA 70112",
                  sender:
                    "John A Simms\nActing Independent Police Monitor\n504-309-9799"
                },
                editStatus: "Generated",
                lastEdited: "2022-04-01T16:07:44.175Z",
                caseDetails: {
                  id: 1,
                  caseReference: "ABC-123",
                  complainantCivilians: opts.complainantCivilians,
                  status: CASE_STATUS.LETTER_IN_PROGRESS,
                  nextStatus: CASE_STATUS.READY_FOR_REVIEW
                },
                draftFilename:
                  "2-12-2017_CC2017-0006_Generated_Referral_Draft_Talls.pdf"
              })
            }
          });

          await provider.addInteraction({
            state: opts.letterState,
            uponReceiving: "get referral letter data",
            withRequest: {
              method: "GET",
              path: "/api/cases/1/referral-letter"
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              },
              body: like({
                id: 1,
                caseId: 1,
                letterOfficers: opts.letterOfficers,
                classifications: opts.classifications
              })
            }
          });

          let store = createConfiguredStore();
          store.dispatch({
            type: "AUTH_SUCCESS",
            userInfo: {
              permissions: [USER_PERMISSIONS.SETUP_LETTER]
            }
          });
          render(
            <Provider store={store}>
              <Router>
                <LetterPreview match={{ params: { id: 1 } }} />
                <SharedSnackbarContainer />
              </Router>
            </Provider>
          );

          await screen.findByTestId("preview-page-header"); // confirm we're on the right page
          await screen.findByText(
            "Now is the winter of our discontent made glorious summer by this son of York"
          );
          let submitBtn = await screen.findByTestId("submit-for-review-button");
          userEvent.click(submitBtn);
          expect(await screen.findByText(opts.errorDialogText))
            .toBeInTheDocument;
        });
      });
      test("should update letter addresses and statuses when provided complete information", async () => {
        await provider.addInteraction({
          state: "letter is ready for review: with civilian complainant",
          uponReceiving: "get letter preview",
          withRequest: {
            method: "GET",
            path: "/api/cases/1/referral-letter/preview"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              letterHtml:
                "<div>Now is the winter of our discontent made glorious summer by this son of York</div>",
              addresses: {
                recipient: "Deputy Superintendent Police Superintendent",
                recipientAddress:
                  "Public Integrity Bureau\nNew Orleans Police Department\n1340 Poydras St Suite 1900\nNew Orleans, LA 70112",
                sender:
                  "John A Simms\nActing Independent Police Monitor\n504-309-9799"
              },
              editStatus: "Generated",
              lastEdited: "2022-04-01T16:07:44.175Z",
              caseDetails: {
                id: 1,
                caseReference: "ABC-123",
                complainantCivilians: [{ id: 1 }],
                status: CASE_STATUS.LETTER_IN_PROGRESS,
                nextStatus: CASE_STATUS.READY_FOR_REVIEW
              },
              draftFilename:
                "2-12-2017_CC2017-0006_Generated_Referral_Draft_Talls.pdf"
            })
          }
        });

        await provider.addInteraction({
          state:
            "letter is ready for review: officer history added: classifications added",
          uponReceiving: "get referral letter data",
          withRequest: {
            method: "GET",
            path: "/api/cases/1/referral-letter"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              id: 1,
              caseId: 1,
              letterOfficers: [
                {
                  id: 1,
                  fullName: "Bad Policeman",
                  officerHistoryOptionId: "3"
                }
              ],
              classifications: { "csfn-1": true }
            })
          }
        });

        await provider.addInteraction({
          state:
            "letter is ready for review: officer history added: classifications added",
          uponReceiving: "update addresses",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/addresses",
            body: like({
              recipient: "Deputy Superintendent Police Superintendent",
              recipientAddress:
                "Public Integrity Bureau\nNew Orleans Police Department\n1340 Poydras St Suite 1900\nNew Orleans, LA 70112",
              sender:
                "John A Simms\nActing Independent Police Monitor\n504-309-9799"
            })
          },
          willRespondWith: {
            status: 200
          }
        });

        await provider.addInteraction({
          state:
            "letter is ready for review: officer history added: classifications added",
          uponReceiving: "update case status",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/status",
            headers: {
              "Content-Type": "application/json"
            },
            body: like({
              status: "Ready for Review"
            })
          },
          willRespondWith: {
            status: 200
          }
        });

        let store = createConfiguredStore();
        store.dispatch({
          type: "AUTH_SUCCESS",
          userInfo: {
            permissions: [USER_PERMISSIONS.SETUP_LETTER]
          }
        });
        render(
          <Provider store={store}>
            <Router>
              <LetterPreview match={{ params: { id: 1 } }} />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        await screen.findByTestId("preview-page-header"); // confirm we're on the right page
        await screen.findByText(
          "Now is the winter of our discontent made glorious summer by this son of York"
        );
        let submitBtn = await screen.findByTestId("submit-for-review-button");
        userEvent.click(submitBtn);
        let dialogSubmitBtn = await screen.findByTestId(
          "update-case-status-button"
        );
        userEvent.click(dialogSubmitBtn);
        expect(await screen.findByText("Status was successfully updated"))
          .toBeInTheDocument;
      });
    });
  }
);
