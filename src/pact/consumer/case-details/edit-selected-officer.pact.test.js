import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import {
  OFFICER_COMPLAINANT,
  OFFICER_WITNESS,
  OFFICER_ACCUSED
} from "./case-details-helper";
import {
  FAKE_USERS,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import SharedSnackbarContainer from "../../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import { push } from "connected-react-router";
import EditOfficerDetails from "../../../client/policeDataManager/officers/OfficerDetails/EditOfficerDetails";
import createConfiguredStore from "../../../client/createConfiguredStore";
import "@testing-library/jest-dom";

const scenarios = [
  {
    currentRole: "Complainant",
    newRole: "Witness",
    options: [OFFICER_COMPLAINANT]
  },
  {
    currentRole: "Complainant",
    newRole: "Accused",
    options: [OFFICER_COMPLAINANT]
  },
  {
    currentRole: "Witness",
    newRole: "Complainant",
    options: [OFFICER_WITNESS]
  },
  {
    currentRole: "Witness",
    newRole: "Accused",
    options: [OFFICER_WITNESS]
  },
  {
    currentRole: "Accused",
    newRole: "Witness",
    options: [OFFICER_ACCUSED]
  },
  {
    currentRole: "Accused",
    newRole: "Complainant",
    options: [OFFICER_ACCUSED]
  }
];

scenarios.forEach(({ currentRole, newRole, options }) => {
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

      describe("change officer", () => {
        let caseId,
          dispatchSpy,
          store,
          caseOfficerId,
          caseEmployeeType,
          caseState,
          officer;
        beforeEach(async () => {
          caseState = "Case exists";
          if (options.includes(OFFICER_COMPLAINANT)) {
            caseState += ": with officer complainant";
          }
          if (options.includes(OFFICER_WITNESS)) {
            caseState += ": with officer witness";
          }
          if (options.includes(OFFICER_ACCUSED)) {
            caseState += ": case has accused officer with allegations";
          }
          store = createConfiguredStore();
          dispatchSpy = jest.spyOn(store, "dispatch");
          caseId = "1";
          caseOfficerId = "1";
          caseEmployeeType = "Officer";

          officer = {
            fullName: "Joel Y Gottlieb",
            isUnknownOfficer: false,
            supervisorFullName: "Lula X Hoppe",
            id: 1,
            officerId: 5453,
            firstName: "Joel",
            middleName: "Y",
            lastName: "Gottlieb",
            employeeId: 18682,
            supervisorFirstName: "Lula",
            supervisorMiddleName: "X",
            supervisorLastName: "Hoppe",
            supervisorEmployeeId: 2561,
            employeeType: "Commissioned",
            caseEmployeeType: "Officer",
            district: "6th District",
            bureau: "FOB - Field Operations Bureau",
            rank: "POLICE OFFICER 4",
            hireDate: "2007-06-24",
            sex: "M",
            race: "White",
            workStatus: "Active",
            notes: "",
            roleOnCase: currentRole,
            isAnonymous: false,
            createdAt: "2022-10-21T18:55:46.053Z",
            updatedAt: "2022-10-21T18:55:46.053Z",
            caseId: 1,
            allegations: newRole === "Accused" ? [] : undefined
          };

          store.dispatch({
            type: "AUTH_SUCCESS",
            userInfo: {
              permissions: [USER_PERMISSIONS.CREATE_CASE]
            }
          });

          await provider.addInteraction({
            state: caseState,
            uponReceiving: `get case`,
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
                attachments: [],
                accusedOfficers:
                  currentRole === "Accused" ? eachLike(officer) : [],
                complainantOfficers:
                  currentRole === "Complainant" ? eachLike(officer) : [],
                witnessOfficers:
                  currentRole === "Witness" ? eachLike(officer) : [],
                status: "Active",
                pdfAvailable: false,
                isArchived: false
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
                {/* <ConnectedOfficerDetailsContainer
                  match={{
                    params: {
                      id: `${caseId}`,
                      caseOfficerId: `${caseOfficerId}`
                    }
                  }}
                  caseId={caseId}
                  titleAction={"Test"}
                  submitButtonText={"Test Officer"}
                  submitAction={editThunkWrapper(caseId, caseOfficerId)}
                  officerSearchUrl={`/cases/${caseId}/officers/search`}
                  selectedOfficer={{
                    roleOnCase: { currentRole }
                  }}
                  initialRoleOnCase={currentRole}
                  caseEmployeeTitle={OFFICER_TITLE}
                  caseEmployeeType={caseEmployeeType}
                /> */}
                <EditOfficerDetails
                  match={{
                    params: {
                      id: `${caseId}`,
                      caseOfficerId: `${caseOfficerId}`,
                      officerId: `${officer.officerId}`,
                      caseEmployeeType: ""
                    }
                  }}
                ></EditOfficerDetails>
                <SharedSnackbarContainer />
              </Router>
            </Provider>
          );
        });

        test("should redirect to search page when click change on selected officer", async () => {
          userEvent.click(await screen.findByTestId("changeOfficerLink"));
          expect(dispatchSpy).toHaveBeenCalledWith(
            push(`/cases/1/officers/1/search`)
          );
        }, 200000);

        test("should change role of officer and redirect back to case detail page on submit", async () => {
          store.dispatch({
            type: "CASE_OFFICER_SELECTED",
            caseOfficer: officer
          });
          const changedOfficer = { ...officer, roleOnCase: newRole };
          await provider.addInteraction({
            state: caseState,
            uponReceiving: `edit ${currentRole}`,
            withRequest: {
              method: "PUT",
              path: `/api/cases/1/cases-officers/1`,
              headers: {
                "Content-Type": "application/json"
              },
              body: like({
                roleOnCase: newRole,
                officerId: currentRole === "Accused" ? 1 : 57
              })
            },

            willRespondWith: {
              status: 200,
              body: like({
                caseReferencePrefix: "CC",
                caseReference: "CC2022-0453",
                id: 1,
                complaintType: "Civilian Initiated",
                statusId: 2,
                year: 2022,
                caseNumber: 453,
                firstContactDate: "2022-10-04",
                intakeSourceId: 3,
                createdAt: "2022-10-04T18:40:59.540Z",
                updatedAt: "2022-10-04T18:41:21.538Z",
                caseClassifications: [],
                intakeSource: {
                  id: 3,
                  name: "In Person",
                  createdAt: "2018-12-21T02:07:39.872Z",
                  updatedAt: "2018-12-21T02:07:39.872Z"
                },
                complainantCivilians: [],
                witnessCivilians: [],
                attachments: [],
                accusedOfficers:
                  newRole === "Accused" ? eachLike(changedOfficer) : [],
                complainantOfficers:
                  newRole === "Complainant" ? eachLike(changedOfficer) : [],
                witnessOfficers:
                  newRole === "Witness" ? eachLike(changedOfficer) : [],
                status: "Active",
                pdfAvailable: false,
                isArchived: false,
                nextStatus: "Letter in Progress"
              })
            }
          });
          await screen.findByText(`Back to Case`);
          userEvent.click(await screen.findByTestId("roleOnCaseInput"));
          userEvent.click(await screen.findByText(`${newRole}`));
          userEvent.click(await screen.findByTestId("officerSubmitButton"));

          expect(
            await screen.findByText("Officer was successfully updated")
          ).toBeInTheDocument();
        }, 200000);
      });
    }
  );
});
