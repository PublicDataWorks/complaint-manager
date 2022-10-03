import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import { setUpCaseDetailsPage } from "./case-details-helper";

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

    describe("add/edit civilians complainant/witnesses", () => {
      beforeEach(async () => await setUpCaseDetailsPage(provider));
      test("should add a civiliant complainant", async () => {
        await provider.addInteraction({
          state:
            "Case exists: race ethnicities exist: gender identities exist: civilian titles exist",
          uponReceiving: "add complainant",
          withRequest: {
            method: "POST",
            path: "/api/cases/1/civilians",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              roleOnCase: "Complainant",
              caseId: 1,
              civilianTitleId: 2,
              firstName: "Andrew",
              lastName: "Rist",
              genderIdentityId: 1,
              raceEthnicityId: 2,
              email: "fakeemail@email.com"
            }
          },
          willRespondWith: {
            status: 201,
            body: like({
              primaryComplainant: {
                fullName: "Andrew Rist",
                id: 3944,
                firstName: "Andrew",
                lastName: "Rist",
                roleOnCase: "Complainant",
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
              },
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
              complainantCivilians: [
                {
                  fullName: "Andrew Rist",
                  id: 3944,
                  firstName: "Andrew",
                  lastName: "Rist",
                  roleOnCase: "Complainant",
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
                }
              ],
              witnessCivilians: [],
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

        const addButtons = await screen.findAllByTestId(
          "addComplainantWitness"
        );

        userEvent.click(addButtons[0]);
        userEvent.click(await screen.findByText("Civilian Complainant"));

        userEvent.click(await screen.findByTestId("firstNameInput"));
        userEvent.type(screen.getByTestId("firstNameInput"), "Andrew");
        userEvent.click(screen.getByTestId("titleInput"));
        userEvent.click(await screen.findByText("Dr."));
        userEvent.click(screen.getByTestId("lastNameInput"));
        userEvent.type(screen.getByTestId("lastNameInput"), "Rist");
        userEvent.click(screen.getByTestId("genderInput"));
        userEvent.click(screen.getByText("Male"));
        userEvent.click(screen.getByTestId("raceEthnicityInput"));
        userEvent.click(screen.getByText("American Indian or Alaska Native"));
        userEvent.click(screen.getByTestId("emailInput"));
        userEvent.type(screen.getByTestId("emailInput"), "fakeemail@email.com");
        userEvent.click(screen.getByTestId("submitEditCivilian"));

        expect(await screen.findByText("Civilian was successfully created"))
          .toBeInTheDocument;
      });
    });
  }
);
