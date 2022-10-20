import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import {
  OFFICER_COMPLAINANT,
  OFFICER_WITNESS,
  setUpCaseDetailsPage
} from "./case-details-helper";

jest.mock(
  "../../../client/policeDataManager/cases/CaseDetails/CivilianDialog/MapServices/MapService",
  () => {
    return jest.fn().mockImplementation(() => ({
      healthCheck: callback => {
        callback({ googleAddressServiceIsAvailable: false });
      }
    }));
  }
);

jest.setTimeout(500000);
const scenarios = [
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "addComplainantWitness",
    method: "POST",
    endpoint: "",
    successMessage: "Officer was successfully added",
    options: []
  },
  {
    role: "Witness",
    buttonIndex: 1,
    buttonTestId: "addComplainantWitness",
    method: "POST",
    endpoint: "",
    successMessage: "Officer was successfully added",
    options: []
  },
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    endpoint: "/1",
    successMessage: "Officer was successfully updated",
    options: [OFFICER_COMPLAINANT]
  },
  {
    role: "Witness",
    buttonIndex: 0,
    buttonTestId: "editOfficerLink",
    method: "PUT",
    endpoint: "/2",
    successMessage: "Officer was successfully updated",
    options: [OFFICER_WITNESS]
  }
];

scenarios.forEach(
  ({
    role,
    buttonIndex,
    buttonTestId,
    method,
    endpoint,
    successMessage,
    options
  }) => {
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

        describe(`add/edit officer ${role}`, () => {
          beforeEach(
            async () => await setUpCaseDetailsPage(provider, ...options)
          );

          test(`should add a officer ${role}`, async () => {
            const officer = {
              fullName: "Jordan G Runolfsson",
              isUnknownOfficer: false,
              supervisorFullName: "Heloise S Witting",
              age: 47,
              id: 6597,
              officerId: 4430,
              firstName: "Jordan",
              middleName: "G",
              lastName: "Runolfsson",
              phoneNumber: null,
              email: "fakeemail@email.com",
              windowsUsername: 18774,
              supervisorFirstName: "Heloise",
              supervisorMiddleName: "S",
              supervisorLastName: "Witting",
              supervisorWindowsUsername: 7838,
              supervisorOfficerNumber: 2212,
              employeeType: "Commissioned",
              caseEmployeeType: "Officer",
              district: "6th District",
              bureau: "FOB - Field Operations Bureau",
              rank: "POLICE OFFICER 4",
              dob: "1975-03-06",
              endDate: null,
              hireDate: "2007-07-29",
              sex: "M",
              race: "Black / African American",
              workStatus: "Active",
              notes: "",
              roleOnCase: "Complainant",
              isAnonymous: false,
              createdAt: "2022-10-20T17:26:38.378Z",
              updatedAt: "2022-10-20T17:26:38.378Z",
              deletedAt: null,
              caseId: 1
            };
            let state = "Case exists";
            if (options.includes(OFFICER_COMPLAINANT)) {
              state += ": with officer complainant";
            }
            if (options.includes(OFFICER_WITNESS)) {
              state += ": with officer witness";
            }
            await provider.addInteraction({
              state,
              uponReceiving: `${method === "POST" ? "add" : "edit"} ${role}`,
              withRequest: {
                method,
                path: "/api/cases/1/cases-officers" + endpoint,
                headers: {
                  "Content-Type": "application/json"
                },
                body: like({
                  roleOnCase: role,
                  caseId: 1,
                  firstName: "Jordan",
                  isAnonymous: false,
                  isUnknown: false,
                  lastName: "Runolfsson",
                  email: "fakeemail@email.com"
                })
              },
              willRespondWith: {
                status: method === "POST" ? 201 : 200,
                body: like({
                  primaryComplainant:
                    role === "Complainant" ? officer : undefined,
                  caseReferencePrefix: "PO",
                  caseReference: "PO2022-0469",
                  id: 1,
                  complaintType: "Civilian Initiated",
                  statusId: 4,
                  year: 2022,
                  caseNumber: 469,
                  firstContactDate: "2022-10-12",
                  incidentDate: null,
                  intakeSourceId: 3,
                  districtId: null,
                  incidentTime: null,
                  incidentTimezone: null,
                  narrativeSummary: "a brief summary",
                  narrativeDetails: "<p>jordan: enemy of the people</p>",
                  pibCaseNumber: null,
                  createdBy: "jng@thoughtworks.com",
                  assignedTo: "jng@thoughtworks.com",
                  createdAt: "2022-10-12T21:13:35.360Z",
                  updatedAt: "2022-10-19T16:21:45.175Z",
                  howDidYouHearAboutUsSourceId: null,
                  caseClassifications: [
                    {
                      id: 3110,
                      caseId: 1,
                      classificationId: 2,
                      createdAt: "2022-10-12T21:14:43.359Z",
                      updatedAt: "2022-10-12T21:14:43.359Z",
                      deletedAt: null
                    }
                  ],
                  intakeSource: {
                    id: 3,
                    name: "In Person",
                    createdAt: "2018-12-21T02:07:39.872Z",
                    updatedAt: "2018-12-21T02:07:39.872Z"
                  },
                  howDidYouHearAboutUsSource: null,
                  caseDistrict: null,
                  complainantCivilians: [],
                  witnessCivilians: [],
                  attachments: [],
                  incidentLocation: null,
                  accusedOfficers: [],
                  complainantOfficers: role === "Complainant" ? [officer] : [],
                  witnessOfficers: role === "Witness" ? [officer] : [],
                  status: "Ready for Review",
                  pdfAvailable: false,
                  isArchived: false,
                  nextStatus: "Forwarded to Agency"
                })
              }
            });

            const buttons = await screen.findAllByTestId(buttonTestId);

            userEvent.click(buttons[buttonIndex]);
            if (method === "POST") {
              userEvent.click(await screen.findByText(`Officer ${role}`));
            }

            userEvent.click(await screen.findByTestId("firstNameField"));
            //userEvent.clear(await screen.findByTestId("firstNameInput"));
            userEvent.type(screen.getByTestId("firstNameField"), "Jordan");
            userEvent.click(screen.getByTestId("lastNameField"));
            //userEvent.clear(screen.getByTestId("lastNameInput"));
            userEvent.type(screen.getByTestId("lastNameField"), "Runolfsson");
            userEvent.click(screen.getByTestId("officerSearchSubmitButton"));
            userEvent.click(screen.getByTestId("selectNewOfficerButton"));
            userEvent.click(screen.getByTestId("emailInput"));
            //userEvent.clear(screen.getByTestId("emailInput"));
            userEvent.type(
              screen.getByTestId("emailInput"),
              "fakeemail@email.com"
            );
            userEvent.click(screen.getByTestId("officerSubmitButton"));

            expect(await screen.findByText(successMessage)).toBeInTheDocument;
          }, 200000);
        });
      }
    );
  }
);
