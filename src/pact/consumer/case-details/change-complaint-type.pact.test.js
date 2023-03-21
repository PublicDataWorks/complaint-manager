import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import { RANK_INITIATED } from "../../../sharedUtilities/constants";
import { setUpCaseDetailsPage } from "./case-details-helper";

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
    describe("Change Complaint Type Dialog", () => {
      beforeEach(async () => {
        setUpCaseDetailsPage(provider, "hasComplaintTypes");
        userEvent.click(await screen.findByTestId("complaintButton"));
      });
      test("should change complaint type", async () => {
        await provider.addInteraction({
          state: "Case exists",
          uponReceiving: "Change Complaint Type",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1",
            headers: {
              "Content-Type": "application/json"
            },
            body: like({
              nextStatus: "Forwarded to Agency",
              caseReferencePrefix: "AC",
              caseReference: "AC2022-0001",
              id: 1,
              complaintType: "Rank Initiated",
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
              complainantInmates: [],
              complainantOfficers: [],
              attachments: [],
              accusedOfficers: [],
              witnessOfficers: [],
              pdfAvailable: false,
              isArchived: false
            })
          },
          willRespondWith: {
            status: 200
          }
        });

        userEvent.click(screen.getByTestId("complaintDropdownInput"));
        const newComplaintType = await screen.findByText(RANK_INITIATED);
        userEvent.click(newComplaintType);
        userEvent.click(screen.getByTestId("changeComplaintTypeSubmitButton"));

        const snackbar = await screen.findByTestId("sharedSnackbarBannerText");
        expect(snackbar.textContent).toInclude("successfully updated");
      });
    });
  }
);
