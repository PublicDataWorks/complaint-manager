import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import createConfiguredStore from "../../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import {
  CASE_STATUSES_RETRIEVED,
  GET_SIGNERS,
  SET_LETTER_TYPE_TO_EDIT
} from "../../../sharedUtilities/constants";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import LetterTypePage from "../../../client/policeDataManager/admin/letterTypes/LetterTypePage";

jest.useRealTimers();
jest.mock("../../../client/policeDataManager/shared/components/FileUpload");

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

    describe("LetterTypePage", () => {
      describe("Edit Letter Type", () => {
        beforeEach(() => {
          const store = createConfiguredStore();
          store.dispatch({
            type: GET_SIGNERS,
            payload: [
              { name: "Billy", nickname: "bill@billy.bil" },
              {
                name: "ABC Pest and Lawn",
                nickname: "abcpestandlawn@gmail.com"
              }
            ]
          });

          store.dispatch({
            type: CASE_STATUSES_RETRIEVED,
            payload: [{ name: "Active" }, { name: "Closed" }]
          });

          store.dispatch({
            type: SET_LETTER_TYPE_TO_EDIT,
            payload: {
              id: 1,
              type: "REFERRAL",
              template: `<html>
                <head>
                  <style>* { font-size: 8.5pt; }</style>
                </head>
                <body>
                  <div id="pageHeader-first">
                    <div style="text-align: center;">{{{header}}}</div>
                  </div>
                  <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;">{{{referralLetter.recipient}}}<br/>{{{formatLongDate currentDate}}}<br/>Page \{{page}}</div>
                  <div id="pageFooter" style="text-align: center; margin-top: 16px">
                    <span style="display:inline-block; margin: 6px 16px 0 0">{{{smallIcon}}}</span>
                    <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">
                      INDEPENDENT POLICE MONITOR<br />
                      2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />
                      Phone (504) 309-9799| Fax (504) 309-7345
                    </span>
                    <span style="display:inline-block; width: 46px">&nbsp;</span>
                  </div>
                  <p>Template</p>
                </body>
              </html>`,
              hasEditPage: false,
              requiresApproval: false,
              requiredStatus: "Initial",
              defaultSender: {
                name: "Nina Ambroise",
                nickname: "Amrose@place.com"
              }
            }
          });

          render(
            <Provider store={store}>
              <Router>
                <LetterTypePage />
                <SharedSnackbarContainer />
              </Router>
            </Provider>
          );
        });

        test("should update and display letter type upon editing", async () => {
          await provider.addInteraction({
            state: "letter types have been added to the database",
            uponReceiving: "edit letter type",
            withRequest: {
              method: "PUT",
              path: "/api/letter-types/1",
              headers: { "Content-Type": "application/json" },
              body: {
                type: "LETTER",
                template: like(`<html>
                  <head>
                    <style>* { font-size: 8.5pt; }</style>
                  </head>
                  <body>
                    <div id="pageHeader-first">
                      <div style="text-align: center;">{{{header}}}</div>
                    </div>
                    <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;">{{{referralLetter.recipient}}}<br/>{{{formatLongDate currentDate}}}<br/>Page \{{page}}</div>
                    <div id="pageFooter" style="text-align: center; margin-top: 16px">
                      <span style="display:inline-block; margin: 6px 16px 0 0">{{{smallIcon}}}</span>
                      <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">
                        INDEPENDENT POLICE MONITOR<br />
                        2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />
                        Phone (504) 309-9799| Fax (504) 309-7345
                      </span>
                      <span style="display:inline-block; width: 46px">&nbsp;</span>
                    </div>
                    <p>Template</p>
                  </body>
                </html>`),
                hasEditPage: false,
                requiresApproval: true,
                requiredStatus: "Initial",
                defaultSender: "Amrose@place.com"
              }
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              },
              body: like({
                id: 1,
                type: "LETTER",
                template: "TEMPLATE",
                hasEditPage: false,
                requiresApproval: true,
                requiredStatus: "Initial",
                defaultSender: {
                  name: "Nina Ambroise",
                  nickname: "Amrose@place.com"
                }
              })
            }
          });

          await screen.findByText("Edit Letter Type");
          userEvent.click(screen.getByTestId("letter-type-input"));
          userEvent.clear(screen.getByTestId("letter-type-input"));
          userEvent.type(screen.getByTestId("letter-type-input"), "LETTER");

          userEvent.click(screen.getByTestId("requires-approval-checkbox"));
          userEvent.click(screen.getByText("Save"));

          expect(await screen.findByText("Successfully edited letter type"))
            .toBeInTheDocument;
        });
      });
    });
  }
);
