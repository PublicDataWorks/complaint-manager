import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import { PERSON_IN_CUSTODY, setUpCaseDetailsPage } from "./case-details-helper";

let state = "Case exists: with person in custody complainant";
const options = [PERSON_IN_CUSTODY];

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

    describe("remove person in custody from case", () => {
      beforeEach(async () => await setUpCaseDetailsPage(provider, ...options));

      test("should remove a person in custody", async () => {
        await provider.addInteraction({
          state,
          uponReceiving: "remove person in custody",
          withRequest: {
            method: "DELETE",
            path: "/api/cases/1/inmates/1"
          },
          willRespondWith: {
            status: 200,
            body: like({
              caseReferencePrefix: "PiC",
              caseReference: "PiC2023-0002",
              id: 1,
              statusId: 2,
              year: 2023,
              caseNumber: 1,
              firstContactDate: "2023-02-22",
              intakeSourceId: 2,
              createdBy: "noipm.infrastructure@gmail.com",
              assignedTo: "noipm.infrastructure@gmail.com",
              createdAt: "2023-02-22T22:17:28.112Z",
              updatedAt: "2023-03-13T19:45:24.441Z",
              caseClassifications: [],
              intakeSource: {
                id: 2,
                name: "Facebook",
                createdAt: "2023-02-16T17:32:39.004Z",
                updatedAt: "2023-02-16T17:32:39.004Z"
              },
              complainantCivilians: [],
              witnessCivilians: [],
              complainantInmates: [],
              witnessInmates: [],
              accusedInmates: [],
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
        userEvent.click(await screen.findByTestId("removePersonInCustodyLink"));
        userEvent.click(await screen.findByTestId("dialog-confirm-button"));
        expect(
          await screen.findByText("Person in Custody was successfully removed")
        ).toBeInTheDocument;
      });
    });
  }
);
