import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import {
  // CIVILIAN_COMPLAINANT,
  // CIVILIAN_WITNESS,
  setUpCaseDetailsPage
} from "./case-details-helper";

let state = "Case exists: with person in custody complainant";

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
      //beforeEach(async () => await setUpCaseDetailsPage(provider, ...options));

      test.todo("should remove a person in custody complainant"); //, async () => {
      //         await provider.addInteraction({
      //           state,
      //           uponReceiving: `remove ${role}`,
      //           withRequest: {
      //             method: "DELETE",
      //             path: "/api/cases/1/inmates/1"
      //           },
      //           willRespondWith: {
      //             status: 200,
      //             body: like({
      //               caseReferencePrefix: "CC",
      //               caseReference: "CC2022-0453",
      //               id: 4022,
      //               complaintType: "Civilian Initiated",
      //               statusId: 2,
      //               year: 2022,
      //               caseNumber: 453,
      //               firstContactDate: "2022-10-04",
      //               intakeSourceId: 3,
      //               createdAt: "2022-10-04T18:40:59.540Z",
      //               updatedAt: "2022-10-04T18:41:21.538Z",
      //               caseClassifications: [],
      //               intakeSource: {
      //                 id: 3,
      //                 name: "In Person",
      //                 createdAt: "2018-12-21T02:07:39.872Z",
      //                 updatedAt: "2018-12-21T02:07:39.872Z"
      //               },
      //               complainantCivilians: [],
      //               witnessCivilians: [],
      //               attachments: [],
      //               accusedOfficers: [],
      //               complainantOfficers: [],
      //               witnessOfficers: [],
      //               status: "Active",
      //               pdfAvailable: false,
      //               isArchived: false,
      //               nextStatus: "Letter in Progress"
      //             })
      //           }
      //         });
      //         userEvent.click(await screen.findByTestId("removePersonInCustodyLink"));
      //         userEvent.click(await screen.findByTestId("removeButton"));
      //         expect(
      //           await screen.findByText("Person in Custody was successfully removed")
      //         ).toBeInTheDocument;
    });
  }
);
//}
// );
