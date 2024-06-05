import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { push } from "connected-react-router";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import InmatesSearch from "../../client/policeDataManager/inmates/InmatesSearch";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import { COMPLAINANT, FAKE_USERS } from "../../sharedUtilities/constants";

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

    describe("Inmate Search Page", () => {
      let dispatchSpy;
      beforeEach(async () => {
        await provider.addInteraction({
          state: "Case exists",
          uponReceiving: "get case",
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
              caseReference: "PiC2023-0001"
            })
          }
        });

        await provider.addInteraction({
          state: "Facilities exist",
          uponReceiving: "retrieve facilities",
          withRequest: {
            method: "GET",
            path: "/api/facilities"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              id: 1,
              abbreviation: "ABC",
              name: "ABC Pest and Lawn"
            })
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

        const store = createConfiguredStore();
        dispatchSpy = jest.spyOn(store, "dispatch");
        render(
          <Provider store={store}>
            <Router>
              <InmatesSearch
                match={{ params: { id: "1", roleOnCase: COMPLAINANT } }}
              />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        await screen.findByTestId("inmate-search-title");
      });

      test("should allow search by facility if facility is selected and clicking Select will submit and redirect to case dashboard", async () => {
        await provider.addInteraction({
          state: "Inmates exist; Facilities exist",
          uponReceiving: "search inmates by facility",
          withRequest: {
            method: "GET",
            path: "/api/inmates/search",
            query: {
              facility: "1",
              page: "1"
            }
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              count: 1,
              rows: [
                {
                  firstName: "Bob",
                  lastName: "Loblaw",
                  fullName: "Bob Loblaw",
                  inmateId: "A0000001",
                  facility: "WCF",
                  gender: "MALE",
                  race: "WHITE",
                  age: 14
                }
              ]
            })
          }
        });

        userEvent.click(screen.getByTestId("facility-input"));
        userEvent.click(await screen.findByText("ABC Pest and Lawn"));
        userEvent.click(screen.getByTestId("inmateSearchSubmitButton"));

        expect(await screen.findByText("1 result found")).toBeInTheDocument();
        expect(await screen.findByText("Bob Loblaw")).toBeInTheDocument();

        userEvent.click(screen.getByText("SELECT"));

        expect(dispatchSpy).toHaveBeenCalledWith(
          push("/cases/1/inmates/Complainant")
        );
      });
    });
  }
);
