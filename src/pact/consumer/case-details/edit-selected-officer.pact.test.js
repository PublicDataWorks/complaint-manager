import React from "react";
import { render, findByTestId, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import {
  OFFICER_COMPLAINANT,
  OFFICER_WITNESS,
  OFFICER_ACCUSED,
  setUpCaseDetailsPage
} from "./case-details-helper";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import SharedSnackbarContainer from "../../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import { addCaseEmployeeType } from "../../../client/policeDataManager/actionCreators/officersActionCreators";
import { push } from "connected-react-router";
import EditOfficerDetails from "../../../client/policeDataManager/officers/OfficerDetails/EditOfficerDetails";
import createConfiguredStore from "../../../client/createConfiguredStore";
import ConnectedOfficerDetailsContainer from "../../../client/policeDataManager/officers/OfficerDetails/OfficerDetailsContainer";
import { editThunkWrapper } from "../../../client/policeDataManager/officers/thunks/officerThunkWrappers";
import { OFFICER_TITLE } from "../../../sharedUtilities/constants";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

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
          state,
          officer;
        beforeEach(async () => {
          state = "Case exists";
          if (options.includes(OFFICER_COMPLAINANT)) {
            state += ": with officer complainant";
          }
          if (options.includes(OFFICER_WITNESS)) {
            state += ": with officer witness";
          }
          if (options.includes(OFFICER_ACCUSED)) {
            state += ": case has accused officer with allegations";
          }
          store = createConfiguredStore();
          dispatchSpy = jest.spyOn(store, "dispatch");
          caseId = "1";
          caseOfficerId = "1";
          caseEmployeeType = PERSON_TYPE.KNOWN_OFFICER.employeeDescription;

          officer = {
            fullName: "Joel Y Gottlieb",
            isUnknownOfficer: false,
            supervisorFullName: "Lula X Hoppe",
            id: 1,
            officerId: 5453,
            firstName: "Joel",
            middleName: "Y",
            lastName: "Gottlieb",
            windowsUsername: 18682,
            supervisorFirstName: "Lula",
            supervisorMiddleName: "X",
            supervisorLastName: "Hoppe",
            supervisorWindowsUsername: 9922,
            supervisorOfficerNumber: 2561,
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
            caseId: 1
          };

          store.dispatch({
            type: "AUTH_SUCCESS",
            userInfo: {
              permissions: [USER_PERMISSIONS.CREATE_CASE]
            }
          });

          await provider.addInteraction({
            state,
            uponReceiving: `get case details`,
            withRequest: {
              method: "GET",
              path: "/api/cases/1"
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
                  currentRole === "Accused" ? eachLike(officer) : [],
                complainantOfficers:
                  currentRole === "Complainant" ? eachLike(officer) : [],
                witnessOfficers:
                  currentRole === "Witness" ? eachLike(officer) : [],
                status: "Active",
                pdfAvailable: false,
                isArchived: false,
                nextStatus: "Letter in Progress"
              })
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
                      caseOfficerId: `${caseOfficerId}`
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
          const changedOfficer = { ...officer, roleOnCase: newRole };
          await provider.addInteraction({
            state,
            uponReceiving: `edit ${currentRole}`,
            withRequest: {
              method: "PUT",
              path: `/api/cases/${caseId}/cases-officers/${caseOfficerId}`,
              body: like({
                roleOnCase: newRole,
                officerId: caseOfficerId
              }),
              headers: { "Content-Type": "application/json" }
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

          userEvent.click(await screen.findByTestId("roleOnCaseInput"));
          userEvent.click(await screen.findByText(`${newRole}`));
          userEvent.click(await screen.findByTestId("officerSubmitButton"));

          expect(await screen.findByText("Officer was successfully updated"))
            .toBeInTheDocument;
        }, 200000);
      });
    }
  );
});
