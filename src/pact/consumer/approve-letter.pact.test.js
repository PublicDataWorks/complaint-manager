import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import ReviewAndApproveLetter from "../../client/policeDataManager/cases/ReferralLetter/ReviewAndApproveLetter/ReviewAndApproveLetter";
import createConfiguredStore from "../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";

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

    describe("review and approve letter page", () => {
      test("should show success message when letter is approved", async () => {
        await provider.addInteraction({
          state: "letter is ready for review",
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
              letterHtml: "<div></div>",
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
                id: 1
              },
              finalFilename: "2-12-2017_CC2017-0006_PIB_Referral_Talls.pdf",
              draftFilename:
                "2-12-2017_CC2017-0006_Generated_Referral_Draft_Talls.pdf"
            })
          }
        });

        await provider.addInteraction({
          state: "letter is ready for review",
          uponReceiving: "get pdf",
          withRequest: {
            method: "GET",
            path: "/api/cases/1/referral-letter/get-pdf"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/octet-stream"
            }
          }
        });

        await provider.addInteraction({
          state: "letter is ready for review",
          uponReceiving: "approve letter",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/approve-letter"
          },
          willRespondWith: {
            status: 200
          }
        });

        render(
          <Provider store={createConfiguredStore()}>
            <Router>
              <ReviewAndApproveLetter match={{ params: { id: 1 } }} />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        userEvent.click(await screen.findByTestId("approve-letter-button"));
        userEvent.click(await screen.findByTestId("update-case-status-button"));

        const snackbar = await screen.findByTestId("sharedSnackbarBannerText");
        expect(snackbar.textContent).toEqual("Status was successfully updated");
      });
    });
  }
);
