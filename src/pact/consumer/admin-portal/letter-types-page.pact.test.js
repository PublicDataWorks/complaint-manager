import React from "react";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import createConfiguredStore from "../../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import {
  CASE_STATUSES_RETRIEVED,
  CIVILIAN_INITIATED,
  GET_COMPLAINT_TYPES_SUCCEEDED,
  GET_SIGNERS,
  RANK_INITIATED,
  SET_LETTER_TYPE_TO_EDIT
} from "../../../sharedUtilities/constants";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import LetterTypePage from "../../../client/policeDataManager/admin/letterTypes/LetterTypePage";
import { change } from "redux-form";
import { getFeaturesSuccess } from "../../../client/policeDataManager/actionCreators/featureTogglesActionCreators";

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
      let store;

      beforeEach(() => {
        store = createConfiguredStore();
        store.dispatch({
          type: GET_SIGNERS,
          payload: [
            { name: "Billy", nickname: "bill@billy.bil" },
            {
              name: "ABC Pest and Lawn",
              nickname: "abcpestandlawn@gmail.com"
            },
            { name: "Nina Ambroise", nickname: "Amrose@place.com" }
          ]
        });

        store.dispatch({
          type: CASE_STATUSES_RETRIEVED,
          payload: [{ name: "Initial" }, { name: "Active" }, { name: "Closed" }]
        });

        store.dispatch({
          type: GET_COMPLAINT_TYPES_SUCCEEDED,
          payload: [{ name: RANK_INITIATED }, { name: CIVILIAN_INITIATED }]
        });

        store.dispatch(
          getFeaturesSuccess({
            chooseDefaultRecipientFeature: true
          })
        );
      });

      describe("Edit Letter Type", () => {
        beforeEach(() => {
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
              },
              defaultRecipient: "{primaryComplainant}",
              defaultRecipientAddress: "{primaryComplainantAddress}",
              complaintTypes: []
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
                defaultSender: "Amrose@place.com",
                defaultRecipient: "{primaryComplainant}",
                defaultRecipientAddress: "{primaryComplainantAddress}",
                complaintTypes: []
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
                },
                defaultRecipient: "{primaryComplainant}",
                defaultRecipientAddress: "{primaryComplainantAddress}",
                complaintTypes: []
              })
            }
          });

          await screen.findByText("Edit Letter Type");
          userEvent.click(screen.getByTestId("letter-type-input"));
          userEvent.clear(screen.getByTestId("letter-type-input"));
          userEvent.type(screen.getByTestId("letter-type-input"), "LETTER");

          userEvent.click(screen.getByTestId("requires-approval-checkbox"));
          userEvent.click(screen.getByText("Primary Complainant"));
          userEvent.click(screen.getByText("Save"));

          expect(await screen.findByText("Successfully edited letter type"))
            .toBeInTheDocument;
        });

        describe("Display Example HTML", () => {
          test("should generate an HTML preview when preview button is clicked", async () => {
            await provider.addInteraction({
              state: "server is running",
              uponReceiving: "show example letter preview",
              withRequest: {
                method: "POST",
                path: "/api/example-letter-preview",
                headers: { "Content-Type": "application/json" },
                body: {
                  template: like(
                    "<section>Hello World {{caseReference}}</section>"
                  ),
                  type: like("REFERRAL")
                }
              },
              willRespondWith: {
                status: 200,
                headers: {
                  "Content-Type": "application/pdf"
                }
              }
            });

            userEvent.click(screen.getByText("Preview"));
            expect(await screen.findByTestId("spinner")).toBeInTheDocument;
            await waitForElementToBeRemoved(screen.getByTestId("spinner"));
          });

          test("should include body template if letter type is editable", async () => {
            await provider.addInteraction({
              state: "server is running",
              uponReceiving: "show example editable letter preview",
              withRequest: {
                method: "POST",
                path: "/api/example-letter-preview",
                headers: { "Content-Type": "application/json" },
                body: {
                  template: like(
                    "<html><body><section>Hello World {{caseReference}}</section>{{letterBody}}</body></html>"
                  ),
                  bodyTemplate: like("<div>I'm a body</div>"),
                  type: like("REFERRAL")
                }
              },
              willRespondWith: {
                status: 200,
                headers: {
                  "Content-Type": "application/pdf"
                }
              }
            });

            userEvent.click(screen.getByTestId("edit-page-checkbox"));

            store.dispatch(
              change(
                "letterTypeForm",
                "editableTemplate",
                "<div>I'm a body</div>"
              )
            );

            userEvent.click(screen.getByText("Preview"));
            expect(await screen.findByTestId("spinner")).toBeInTheDocument;
            await waitForElementToBeRemoved(screen.getByTestId("spinner"));
          });
        });
      });

      describe("Add Letter Type", () => {
        test("should add new letter type", async () => {
          await provider.addInteraction({
            state: "user is administrator",
            uponReceiving: "add letter type",
            withRequest: {
              method: "POST",
              path: "/api/letter-types",
              headers: { "Content-Type": "application/json" },
              body: {
                type: "NEW LETTER TYPE",
                template: like("template"),
                requiresApproval: true,
                requiredStatus: "Initial",
                defaultSender: "Amrose@place.com",
                complaintTypes: [RANK_INITIATED]
              }
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              },
              body: like({
                id: 2,
                type: "LETTER",
                template: "TEMPLATE",
                hasEditPage: false,
                requiresApproval: true,
                requiredStatus: "Initial",
                defaultSender: {
                  name: "Nina Ambroise",
                  nickname: "Amrose@place.com"
                },
                complaintTypes: [RANK_INITIATED]
              })
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

          await screen.findByText("Add Letter Type");
          userEvent.click(screen.getByTestId("letter-type-input"));
          userEvent.clear(screen.getByTestId("letter-type-input"));
          userEvent.type(
            screen.getByTestId("letter-type-input"),
            "NEW LETTER TYPE"
          );

          userEvent.click(screen.getByLabelText(CIVILIAN_INITIATED));

          userEvent.click(screen.getByTestId("default-sender-dropdown"));
          userEvent.click(await screen.findByText("Nina Ambroise"));

          userEvent.click(screen.getByTestId("required-status-dropdown"));
          userEvent.type(await screen.findByText("Initial"));

          userEvent.click(screen.getByTestId("requires-approval-checkbox"));
          userEvent.click(screen.getByText("Save"));

          expect(await screen.findByText("Successfully added letter type"))
            .toBeInTheDocument;
        });
      });
    });
  }
);
