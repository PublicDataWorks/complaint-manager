import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import {
  CIVILIAN_COMPLAINANT,
  CIVILIAN_WITNESS,
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
    successMessage: "Civilian was successfully created",
    options: []
  },
  {
    role: "Witness",
    buttonIndex: 1,
    buttonTestId: "addComplainantWitness",
    method: "POST",
    endpoint: "",
    successMessage: "Civilian was successfully created",
    options: []
  },
  {
    role: "Complainant",
    buttonIndex: 0,
    buttonTestId: "editComplainantLink",
    method: "PUT",
    endpoint: "/1",
    successMessage: "Civilian was successfully updated",
    options: [CIVILIAN_COMPLAINANT]
  },
  {
    role: "Witness",
    buttonIndex: 0,
    buttonTestId: "editComplainantLink",
    method: "PUT",
    endpoint: "/2",
    successMessage: "Civilian was successfully updated",
    options: [CIVILIAN_WITNESS]
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

        describe(`add/edit civilian ${role}`, () => {
          beforeEach(
            async () => await setUpCaseDetailsPage(provider, ...options)
          );

          test(`should add a civilian ${role}`, async () => {
            const civilian = {
              fullName: "Andrew Rist",
              id: 3944,
              firstName: "Andrew",
              lastName: "Rist",
              roleOnCase: role,
              email: "fakeemail@email.com",
              isAnonymous: false,
              createdAt: "2022-09-29T18:24:28.907Z",
              updatedAt: "2022-09-29T18:24:28.907Z",
              caseId: 1,
              raceEthnicityId: 17,
              genderIdentityId: 1,
              civilianTitleId: 2,
              raceEthnicity: {
                id: 17,
                name: "White",
                createdAt: "2019-01-07T20:08:30.512Z",
                updatedAt: "2019-01-07T20:08:30.512Z"
              },
              genderIdentity: {
                id: 1,
                name: "Male",
                createdAt: "2019-04-19T21:31:23.009Z",
                updatedAt: "2019-04-19T21:31:23.009Z"
              }
            };

            let state =
              "Case exists: race ethnicities exist: gender identities exist: civilian titles exist";
            if (options.includes(CIVILIAN_COMPLAINANT)) {
              state += ": with civilian complainant";
            }
            if (options.includes(CIVILIAN_WITNESS)) {
              state += ": with civilian witness";
            }
            await provider.addInteraction({
              state,
              uponReceiving: `${method === "POST" ? "add" : "edit"} ${role}`,
              withRequest: {
                method,
                path: "/api/cases/1/civilians" + endpoint,
                headers: {
                  "Content-Type": "application/json"
                },
                body: like({
                  roleOnCase: role,
                  caseId: 1,
                  civilianTitleId: 2,
                  firstName: "Andrew",
                  isAnonymous: false,
                  isUnknown: false,
                  lastName: "Rist",
                  genderIdentityId: 1,
                  raceEthnicityId: 2,
                  email: "fakeemail@email.com"
                })
              },
              willRespondWith: {
                status: method === "POST" ? 201 : 200,
                body: like({
                  primaryComplainant:
                    role === "Complainant" ? civilian : undefined,
                  caseReferencePrefix: "CC",
                  caseReference: "CC2020-0482",
                  id: 1,
                  complaintType: "Civilian Initiated",
                  statusId: 4,
                  year: 2020,
                  caseNumber: 482,
                  firstContactDate: "2020-08-14",
                  incidentDate: "2017-12-20",
                  intakeSourceId: 3,
                  incidentTime: "02:31:00",
                  incidentTimezone: "CST",
                  narrativeSummary: "test summary data",
                  narrativeDetails: "<p>test details data</p>",
                  createdBy: "noipm.infrastructure@gmail.com",
                  assignedTo: "noipm.infrastructure@gmail.com",
                  createdAt: "2020-08-14T14:30:31.302Z",
                  updatedAt: "2020-08-14T15:37:23.668Z",
                  intakeSource: {
                    id: 3,
                    name: "In Person",
                    createdAt: "2018-12-21T02:07:39.872Z",
                    updatedAt: "2018-12-21T02:07:39.872Z"
                  },
                  complainantCivilians:
                    role === "Complainant" ? [civilian] : [],
                  witnessCivilians: role === "Witness" ? [civilian] : [],
                  attachments: [],
                  accusedOfficers: [],
                  complainantOfficers: [],
                  witnessOfficers: [],
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
              userEvent.click(await screen.findByText(`Civilian ${role}`));
            }

            userEvent.click(await screen.findByTestId("firstNameInput"));
            userEvent.clear(await screen.findByTestId("firstNameInput"));
            userEvent.type(screen.getByTestId("firstNameInput"), "Andrew");
            userEvent.click(screen.getByTestId("titleInput"));
            userEvent.click(await screen.findByText("Dr."));
            userEvent.click(screen.getByTestId("lastNameInput"));
            userEvent.clear(screen.getByTestId("lastNameInput"));
            userEvent.type(screen.getByTestId("lastNameInput"), "Rist");
            userEvent.click(screen.getByTestId("genderInput"));
            userEvent.click(screen.getByText("Male"));
            userEvent.click(screen.getByTestId("raceEthnicityInput"));
            userEvent.click(
              screen.getByText("American Indian or Alaska Native")
            );
            userEvent.click(screen.getByTestId("emailInput"));
            userEvent.clear(screen.getByTestId("emailInput"));
            userEvent.type(
              screen.getByTestId("emailInput"),
              "fakeemail@email.com"
            );
            userEvent.click(screen.getByTestId("submitEditCivilian"));

            expect(await screen.findByText(successMessage)).toBeInTheDocument;
          }, 200000);
        });
      }
    );
  }
);
