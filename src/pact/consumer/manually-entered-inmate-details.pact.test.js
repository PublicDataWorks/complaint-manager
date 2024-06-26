import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import ManuallyEnteredInmateDetails from "../../client/policeDataManager/inmates/ManuallyEnteredInmateDetails";
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

    describe("Manually Entered Inmate Details Page", () => {
      beforeEach(async () => {
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

        render(
          <Provider store={createConfiguredStore()}>
            <Router>
              <ManuallyEnteredInmateDetails
                match={{ params: { id: "1", roleOnCase: COMPLAINANT } }}
              />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );
      });

      test("should post to cases/1/inmates when form is filled in", async () => {
        const NOTES = "These are notes!!";
        const FIRST_NAME = "Patrick";
        const MIDDLE_INITIAL = "K";
        const LAST_NAME = "Star";
        const SUFFIX = "Jr.";
        const INMATE_ID = "A0383838";
        const FACILITY = "ABC Pest and Lawn";

        await provider.addInteraction({
          state: "Case exists",
          uponReceiving: "manually add inmate",
          withRequest: {
            method: "POST",
            path: "/api/cases/1/inmates",
            headers: {
              "Content-type": "application/json"
            },
            body: {
              notes: NOTES,
              roleOnCase: COMPLAINANT,
              firstName: FIRST_NAME,
              middleInitial: MIDDLE_INITIAL,
              lastName: LAST_NAME,
              suffix: SUFFIX,
              notFoundInmateId: INMATE_ID,
              facility: FACILITY
            }
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              id: 1,
              notes: NOTES,
              roleOnCase: COMPLAINANT,
              firstName: FIRST_NAME,
              middleInitial: MIDDLE_INITIAL,
              lastName: LAST_NAME,
              suffix: SUFFIX,
              notFoundInmateId: INMATE_ID,
              facility: FACILITY
            })
          }
        });

        userEvent.type(screen.getByTestId("notesField"), NOTES);
        userEvent.type(screen.getByTestId("firstNameField"), FIRST_NAME);
        userEvent.type(
          screen.getByTestId("middleInitialField"),
          MIDDLE_INITIAL
        );
        userEvent.type(screen.getByTestId("lastNameField"), LAST_NAME);
        userEvent.type(screen.getByTestId("suffixField"), SUFFIX);
        userEvent.type(screen.getByTestId("inmateIdField"), INMATE_ID);
        userEvent.click(screen.getByTestId("facilityField"));
        userEvent.click(await screen.findByText(FACILITY));
        userEvent.click(screen.getByTestId("inmate-submit-button"));
        expect(
          await screen.findByText(
            "Successfully added Person in Custody to case"
          )
        );
      });
    });
  }
);
