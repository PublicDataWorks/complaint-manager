import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import {
  CASE_STATUS,
  GET_CASE_DETAILS_SUCCESS,
  USER_PERMISSIONS
} from "../../sharedUtilities/constants";
import GeneralLetterPreview from "../../client/policeDataManager/cases/ReferralLetter/LetterPreview/GeneralLetterPreview";

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

    describe("general letter preview page", () => {
      test("should update letter addresses and statuses when provided complete information", async () => {
        await provider.addInteraction({
          state: "general letter exists",
          uponReceiving: "get general letter preview",
          withRequest: {
            method: "GET",
            path: "/api/cases/1/letters/1/preview"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              letterHtml:
                "<p>Now is the winter of our discontent made glorious summer by this son of York</p>",
              editStatus: "Generated",
              lastEdited: "2023-03-02T20:10:51.550Z",
              caseDetails: {
                caseReferencePrefix: "AC",
                caseReference: "AC2023-0080",
                id: 1,
                year: 2023,
                caseNumber: 80,
                firstContactDate: "2023-02-28",
                createdBy: "jng@thoughtworks.com",
                assignedTo: "jng@thoughtworks.com",
                pdfAvailable: false,
                isArchived: false,
                nextStatus: "Initial"
              },
              finalFilename: "2-28-2023_AC2023-0080_Lettor.pdf",
              draftFilename: "2-28-2023_AC2023-0080_Lettor.pdf"
            })
          }
        });

        await provider.addInteraction({
          state: "general letter exists",
          uponReceiving: "update addresses",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/letters/1/addresses",
            body: like({
              recipient: "Bob Loblaw",
              recipientAddress: "Bob Loblaw's Law Blog",
              sender: "Lindsay Bluth"
            })
          },
          willRespondWith: {
            status: 200
          }
        });

        await provider.addInteraction({
          state: "general letter exists",
          uponReceiving: "generate letter",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/letters/1",
            headers: {
              "Content-type": "application/json"
            },
            body: {
              editStatus: "Finalized"
            }
          },
          willRespondWith: {
            status: 200,
            body: {}
          }
        });

        let store = createConfiguredStore();
        store.dispatch({
          type: "AUTH_SUCCESS",
          userInfo: {
            permissions: [USER_PERMISSIONS.SETUP_LETTER]
          }
        });

        store.dispatch({
          type: GET_CASE_DETAILS_SUCCESS,
          caseDetails: {
            id: 1,
            status: CASE_STATUS.LETTER_IN_PROGRESS
          }
        });

        render(
          <Provider store={store}>
            <Router>
              <GeneralLetterPreview
                match={{ params: { id: "1", letterId: "1" } }}
              />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        await screen.findByTestId("preview-page-header"); // confirm we're on the right page
        await screen.findByText(
          "Now is the winter of our discontent made glorious summer by this son of York"
        );

        userEvent.type(screen.getByTestId("recipient-field"), "Bob Loblaw");
        userEvent.type(
          screen.getByTestId("recipient-address-field"),
          "Bob Loblaw's Law Blog"
        );
        userEvent.type(screen.getByTestId("sender-field"), "Lindsay Bluth");

        let submitBtn = await screen.findByTestId("generate-letter-button");
        userEvent.click(submitBtn);
        expect(
          await screen.findByText("Letter was generated successfully")
        ).toBeInTheDocument();
      });
    });
  }
);
