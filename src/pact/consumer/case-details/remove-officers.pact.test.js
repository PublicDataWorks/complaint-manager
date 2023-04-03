import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import {
  OFFICER_COMPLAINANT,
  OFFICER_WITNESS,
  OFFICER_ACCUSED,
  setUpCaseDetailsPage
} from "./case-details-helper";

const scenarios = [
  {
    role: "Complainant",
    options: [OFFICER_COMPLAINANT]
  },
  {
    role: "Witness",
    options: [OFFICER_WITNESS]
  },
  {
    role: "Accused",
    options: [OFFICER_ACCUSED]
  }
];

scenarios.forEach(({ role, options }) => {
  let state = "Case exists";
  if (options.includes(OFFICER_COMPLAINANT)) {
    state += ": with officer complainant";
  }
  if (options.includes(OFFICER_WITNESS)) {
    state += ": with officer witness";
  }
  if (options.includes(OFFICER_ACCUSED)) {
    state += ": case has accused officer with allegations";
  }
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

      describe(`remove officer ${role}`, () => {
        beforeEach(async () => {
          await setUpCaseDetailsPage(provider, ...options);
        });

        test(`should remove a officer ${role}`, async () => {
          await provider.addInteraction({
            state,
            uponReceiving: `remove ${role}`,
            withRequest: {
              method: "DELETE",
              path: "/api/cases/1/cases-officers/1"
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
                accusedOfficers: [],
                complainantOfficers: [],
                witnessOfficers: [],
                status: "Active",
                pdfAvailable: false,
                isArchived: false,
                nextStatus: "Letter in Progress"
              })
            }
          });

          if (role === "Accused") {
            userEvent.click(await screen.findByTestId("manageCaseOfficer"));
            userEvent.click(await screen.findByTestId("removeCaseOfficer"));
          } else {
            userEvent.click(await screen.findByTestId("removeOfficerLink"));
          }

          userEvent.click(await screen.findByTestId("dialog-confirm-button"));
          expect(await screen.findByText("Officer was successfully removed"))
            .toBeInTheDocument;
        });
      });
    }
  );
});
