import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SelectedInmateDetails from "../../client/policeDataManager/inmates/SelectedInmateDetails";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import { push } from "connected-react-router";

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
              primaryComplainant: {
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
              caseReferencePrefix: "PiC",
              caseReference: "PiC2023-0001",
              id: 1,
              complainantInmates: [
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
                }
              ],
              witnessInmates: [],
              accusedInmates: []
            })
          }
        });

        render(
          <Provider store={store}>
            <Router>
              <SelectedInmateDetails
                match={{ params: { id: "1", caseInmateId: "1" } }}
              />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );
      });

      test("should update inmate when anonymous checkbox is selected", async () => {
        await provider.addInteraction({
          state: "Case exists: with person in custody complainant",
          uponReceiving: "updating existing inmate",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/inmates/1",
            headers: {
              "Content-type": "application/json"
            },
            body: {
              notes: "some notes.",
              isAnonymous: true
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
