import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import {
  CASE_STATUS,
  CONFIGS,
  GET_CONFIGS_SUCCEEDED,
  USER_PERMISSIONS
} from "../../sharedUtilities/constants";
import LetterReview from "../../client/policeDataManager/cases/ReferralLetter/LetterReview/LetterReview";

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

    describe("letter review page", () => {
      test("should render letter review page with correct data", async () => {
        await provider.addInteraction({
          state:
            "letter is ready for review: with civilian complainant with accused officer",
          uponReceiving: "get letter review data",
          withRequest: {
            method: "GET",
            path: "/api/cases/1"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              id: 1,
              status: CASE_STATUS.LETTER_IN_PROGRESS,
              isArchived: false,
              caseReference: "PO2022-0721",
              complainantCivilians: eachLike({
                fullName: "Martha Stewart"
              }),
              complainantOfficers: eachLike({
                id: 1,
                caseEmployeeType: "Officer",
                isUnknownOfficer: false,
                fullName: "Karen Tuti",
                employeeId: 345,
                district: "5th District"
              }),
              accusedOfficers: eachLike({
                id: 1,
                caseEmployeeType: "Officer",
                isUnknownOfficer: false,
                fullName: "Barry Goldwater",
                employeeId: 678,
                district: "5th District",
                allegations: eachLike({
                  allegation: {
                    rule: "croix ramps",
                    paragraph:
                      "etsy tousled hoodie sriracha wayfarers poutine tumeric kinfolk",
                    directive: " yuccie praxis"
                  },
                  severity: "very severe",
                  details:
                    "Post-ironic poutine 90's cold-pressed, vice polaroid banjo 3 wolf moon cred"
                })
              }),
              witnessCivilians: [],
              witnessOfficers: []
            })
          }
        });

        await provider.addInteraction({
          state: "letter is ready for review",
          uponReceiving: "get letter review status",
          withRequest: {
            method: "GET",
            path: "/api/cases/1/referral-letter/edit-status"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              editStatus: "Generated"
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

        store.dispatch({
          type: GET_CONFIGS_SUCCEEDED,
          payload: {
            [CONFIGS.ORGANIZATION]: "tonx",
            [CONFIGS.PD]: "cred copper"
          }
        });

        render(
          <Provider store={store}>
            <Router>
              <LetterReview match={{ params: { id: "1" } }} />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        const civilianElement = await screen.findByTestId("Civilian Name");
        const officerElement = await screen.findAllByTestId("Officer Name");

        expect(civilianElement.textContent).toInclude("Martha Stewart");
        expect(officerElement[0].textContent).toInclude("Karen Tuti");
        expect(officerElement[1].textContent).toInclude("Barry Goldwater");
      });
    });
  }
);
