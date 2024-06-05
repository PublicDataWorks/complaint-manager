import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import EditGeneralLetter from "../../client/policeDataManager/cases/ReferralLetter/EditLetter/EditGeneralLetter";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import {
  EDIT_LETTER_HTML_FORM,
  FAKE_USERS
} from "../../sharedUtilities/constants";
import { change } from "redux-form";

jest.mock("react-quill", () => props => (
  <div __dangerouslySetInnerHtml={{ html: props.value }}></div>
));

const ADDED_TEXT = "Sarah and Phoebe are the G.O.A.T.s";

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

    describe("edit letter page", () => {
      test("should add input text to the letter", async () => {
        await provider.addInteraction({
          state: "general letter exists",
          uponReceiving: "get letter preview",
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
              letterHtml: "<div data-testid='editDiv'>test</div>",
              addresses: {
                recipient: "Deputy Superintendent Police Superintendent",
                recipientAddress:
                  "Public Integrity Bureau\nNew Orleans Police Department\n1340 Poydras St Suite 1900\nNew Orleans, LA 70112",
                sender:
                  "John A Simms\nActing Independent Police Monitor\n504-309-9799"
              },
              editStatus: "Generated",
              lastEdited: "2022-04-01T16:07:44.175Z",
              finalFilename: "2-12-2017_CC2017-0006_PIB_Referral_Talls.pdf",
              draftFilename:
                "2-12-2017_CC2017-0006_Generated_Referral_Draft_Talls.pdf"
            })
          }
        });

        await provider.addInteraction({
          state: "general letter exists",
          uponReceiving: "update letter content",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/letters/1/content",
            body: like(`<div>${ADDED_TEXT}</div>`)
          },
          willRespondWith: {
            status: 200
          }
        });

        await provider.addInteraction({
          uponReceiving: "get users",
          withRequest: {
            method: "GET",
            path: "/api/users"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike(FAKE_USERS[0])
          }
        });

        let store = createConfiguredStore();

        render(
          <Provider store={store}>
            <Router>
              <EditGeneralLetter
                dirty={false}
                invalidCaseStatusRedirect={jest.fn()}
                letterHtml="<div></div>"
                match={{ params: { id: 1, letterId: 1 } }}
              />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        expect(await screen.findByTestId("save-button")).toBeInTheDocument();

        store.dispatch(
          change(
            EDIT_LETTER_HTML_FORM,
            "editedLetterHtml",
            `<div>${ADDED_TEXT}</div>`
          )
        );

        await waitFor(() =>
          expect(
            screen.getByTestId("save-button").className.includes("Mui-disabled")
          ).toBeFalse()
        );

        userEvent.click(screen.getByTestId("save-button"));

        const snackbar = await screen.findByTestId("sharedSnackbarBannerText");
        expect(snackbar.textContent).toEqual("Letter was successfully updated");
      });
    });
  }
);
