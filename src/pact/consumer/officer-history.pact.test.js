import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import {
  CONFIGS,
  GET_CONFIGS_SUCCEEDED,
  USER_PERMISSIONS
} from "../../sharedUtilities/constants";
import OfficerHistories from "../../client/policeDataManager/cases/ReferralLetter/OfficerHistories/OfficerHistories";

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

    describe("officer history page", () => {
      let option;
      beforeEach(async () => {
        await provider.addInteraction({
          state:
            "letter is ready for review: with civilian complainant with accused officer",
          uponReceiving: "get referral letter details",
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
              letterOfficers: eachLike({
                caseOfficerId: 1,
                fullName: "Alexane C Barrows",
                id: 1
              }),
              classifications: {}
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

        await provider.addInteraction({
          state: "letter is ready for review",
          uponReceiving: "get minimum case details",
          withRequest: {
            method: "GET",
            path: "/api/cases/1/minimum-case-details"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              caseReference: "CC2022-0003",
              status: "Letter in Progress"
            })
          }
        });

        await provider.addInteraction({
          state: "officer history options exist",
          uponReceiving: "get officer history options",
          withRequest: {
            method: "GET",
            path: "/api/officer-history-options"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              id: 4,
              name: "Officer has significant/noteworthy history"
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
              <OfficerHistories match={{ params: { id: "1" } }} />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        option = await screen.findByText(
          "Officer has significant/noteworthy history"
        );
      });

      test("officer has significant history including allegations", async () => {
        await provider.addInteraction({
          state: "letter is ready for review",
          uponReceiving: "update officer history including allegations",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/officer-history",
            body: {
              letterOfficers: [
                {
                  id: 1,
                  caseOfficerId: 1,
                  fullName: "Alexane C Barrows",
                  officerHistoryOptionId: "4",
                  numHistoricalHighAllegations: "1",
                  numHistoricalMedAllegations: "2"
                }
              ]
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        userEvent.click(option);
        fireEvent.change(await screen.findByTestId("high-allegations"), {
          target: { value: "1" }
        });
        fireEvent.change(await screen.findByTestId("medium-allegations"), {
          target: { value: "2" }
        });
        userEvent.click(await screen.findByText("Next"));
        expect(
          await screen.findByText(
            "Officer complaint history was successfully updated"
          )
        ).toBeInTheDocument;
      });

      test("choose history option without extra details", async () => {
        await provider.addInteraction({
          state: "letter is ready for review",
          uponReceiving: "update officer history",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/officer-history",
            body: {
              letterOfficers: [
                {
                  id: 1,
                  caseOfficerId: 1,
                  fullName: "Alexane C Barrows",
                  officerHistoryOptionId: "4"
                }
              ]
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        userEvent.click(option);
        userEvent.click(await screen.findByText("Next"));
        expect(
          await screen.findByText(
            "Officer complaint history was successfully updated"
          )
        ).toBeInTheDocument;
      });
    });
  }
);
