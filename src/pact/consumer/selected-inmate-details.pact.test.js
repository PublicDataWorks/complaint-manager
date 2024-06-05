import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SelectedInmateDetails from "../../client/policeDataManager/inmates/SelectedInmateDetails";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import { push } from "connected-react-router";
import { selectInmate } from "../../client/policeDataManager/actionCreators/inmateActionCreators";
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

    describe("Selected Inmate Details Page", () => {
      let store, dispatchSpy;

      beforeEach(async () => {
        store = createConfiguredStore();
        dispatchSpy = jest.spyOn(store, "dispatch");

        store.dispatch(
          selectInmate(
            {
              fullName: "",
              id: 1,
              inmateId: "A6084745",
              roleOnCase: "Complainant",
              isAnonymous: false,
              caseId: 1,
              inmate: {
                fullName: "Robin Archuleta",
                inmateId: "A6084745",
                firstName: "Robin",
                lastName: "Archuleta",
                region: "HAWAII",
                facility: "WCCC",
                facilityId: 6
              }
            },
            COMPLAINANT
          )
        );

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
              caseReferencePrefix: "PiC",
              caseReference: "PiC2023-0001",
              id: 1,
              complainantInmates: [],
              witnessInmates: [],
              accusedInmates: []
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
          <Provider store={store}>
            <Router>
              <SelectedInmateDetails
                match={{ params: { id: "1", roleOnCase: COMPLAINANT } }}
              />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );
      });

      test("should update inmate when anonymous checkbox is selected", async () => {
        await provider.addInteraction({
          state: "Case exists",
          uponReceiving: "adding inmate",
          withRequest: {
            method: "POST",
            path: "/api/cases/1/inmates",
            headers: {
              "Content-type": "application/json"
            },
            body: {
              notes: "some notes.",
              isAnonymous: true,
              inmateId: "A6084745",
              roleOnCase: COMPLAINANT
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        userEvent.click(screen.getByTestId("isInmateAnonymous"));
        userEvent.type(screen.getByTestId("notesField"), "some notes.");
        userEvent.click(screen.getByTestId("inmate-submit-button"));

        expect(
          await screen.findByText(
            "Person in Custody Successfully Added to Case"
          )
        );
        expect(dispatchSpy).toHaveBeenCalledWith(push("/cases/1"));
      });
    });
  }
);
