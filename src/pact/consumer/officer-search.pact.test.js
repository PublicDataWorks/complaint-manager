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
import { USER_PERMISSIONS } from "../../sharedUtilities/constants";
import AddOfficerSearch from "../../client/policeDataManager/officers/OfficerSearch/AddOfficerSearch";
import { selectOfficer } from "../../client/policeDataManager/actionCreators/officersActionCreators";

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

    describe("officer search page", () => {
      let districtSelect, dispatchSpy;
      const officer = {
        fullName: "Bob Loblaw",
        age: 74,
        id: 1,
        officerNumber: 6135,
        firstName: "Gideon",
        middleName: "B",
        lastName: "Abshire",
        rank: "POLICE RECRUIT FIELD",
        race: "White",
        sex: "M",
        dob: "1948-05-07",
        districtId: 2,
        bureau: "FOB - Field Operations Bureau",
        workStatus: "Active",
        hireDate: "2016-07-17",
        employeeType: "Commissioned",
        windowsUsername: 29281,
        officerDistrict: {
          id: 1,
          name: "1st District"
        }
      };

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
              nextStatus: "Forwarded to Agency",
              caseReferencePrefix: "AC",
              caseReference: "AC2022-0001",
              id: 1,
              complaintType: "Civilian Initiated",
              status: "Ready for Review",
              year: 2022,
              caseNumber: 1,
              firstContactDate: "2022-08-22",
              intakeSourceId: 3,
              createdBy: "noipm.infrastructure@gmail.com",
              assignedTo: "noipm.infrastructure@gmail.com",
              createdAt: "2022-08-22T15:55:45.879Z",
              updatedAt: "2022-08-22T15:56:27.641Z",
              intakeSource: {
                id: 3,
                name: "In Person",
                createdAt: "2022-08-19T16:45:01.760Z",
                updatedAt: "2022-08-19T16:45:01.760Z"
              },
              complainantCivilians: [],
              witnessCivilians: [],
              complainantOfficers: [],

              attachments: [],
              accusedOfficers: [],
              witnessOfficers: [],
              pdfAvailable: false,
              isArchived: false
            })
          }
        });

        await provider.addInteraction({
          state: "districts exist",
          uponReceiving: "get districts",
          withRequest: {
            method: "GET",
            path: "/api/districts"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike(["1st District", 1])
          }
        });

        let store = createConfiguredStore();

        store.dispatch({
          type: "AUTH_SUCCESS",
          userInfo: {
            permissions: [USER_PERMISSIONS.CREATE_CASE]
          }
        });

        dispatchSpy = jest.spyOn(store, "dispatch");
        render(
          <Provider store={store}>
            <Router>
              <AddOfficerSearch match={{ params: { id: "1" } }} />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        districtSelect = await screen.findByTestId("districtInput");
      });

      test("Search officers by name and select one", async () => {
        await provider.addInteraction({
          state: "Officer Bob Loblaw exists and works in the first district",
          uponReceiving: "search for Officer Bob Loblaw",
          withRequest: {
            method: "GET",
            path: "/api/officers/search",
            query: {
              firstName: "Bob",
              lastName: "Loblaw",
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
              rows: eachLike(officer)
            })
          }
        });

        userEvent.type(await screen.findByTestId("firstNameField"), "Bob");
        userEvent.type(screen.getByTestId("lastNameField"), "Loblaw");
        userEvent.click(screen.getByTestId("officerSearchSubmitButton"));
        expect(await screen.findByText("1st District")).toBeInTheDocument;

        userEvent.click(screen.getByTestId("selectNewOfficerButton"));
        expect(dispatchSpy).toHaveBeenCalledWith(selectOfficer(officer));
      });

      test("Search officer by district and select one", async () => {
        await provider.addInteraction({
          state: "Officer Bob Loblaw exists and works in the first district",
          uponReceiving: "search for officers from 1st District",
          withRequest: {
            method: "GET",
            path: "/api/officers/search",
            query: {
              districtId: "1",
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
              rows: eachLike(officer)
            })
          }
        });

        userEvent.click(districtSelect);
        userEvent.click(await screen.findByText("1st District"));
        userEvent.click(screen.getByTestId("officerSearchSubmitButton"));
        expect(await screen.findByText("Bob Loblaw")).toBeInTheDocument;

        userEvent.click(screen.getByTestId("selectNewOfficerButton"));
        expect(dispatchSpy).toHaveBeenCalledWith(selectOfficer(officer));
      });
    });
  }
);
