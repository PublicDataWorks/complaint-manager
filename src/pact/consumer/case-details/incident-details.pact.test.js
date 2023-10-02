import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import { setUpCaseDetailsPage } from "./case-details-helper";
import "@testing-library/jest-dom";

jest.mock(
  "../../../client/policeDataManager/cases/CaseDetails/PersonOnCaseDialog/MapServices/MapService"
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

    describe("incident details", () => {
      beforeEach(async () => await setUpCaseDetailsPage(provider));
      test("should change incident details", async () => {
        await provider.addInteraction({
          state:
            "Case exists; districts exist; intake sources exsist; how did you hear about us sources exist",
          uponReceiving: "edit incident details",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1",
            headers: {
              "Content-Type": "application/json"
            },
            body: like({
              id: 1,
              districtId: 1,
              firstContactDate: "2022-09-06",
              howDidYouHearAboutUsSourceId: 1,
              intakeSourceId: 1,
              pibCaseNumber: "76960"
            })
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
              accusedOfficers: [],
              complainantOfficers: [],
              witnessOfficers: [],
              pdfAvailable: false,
              isArchived: false
            })
          }
        });

        const editButton = await screen.findByTestId(
          "editIncidentDetailsButton"
        );

        userEvent.click(editButton);

        await screen.findByText("Edit Incident Details");

        userEvent.click(await screen.findByTestId("districtInput"));
        userEvent.click(await screen.findByText("1st District"));

        userEvent.click(await screen.findByTestId("intakeSourceInput"));
        userEvent.click(await screen.findByText("Email"));

        userEvent.click(
          await screen.findByTestId("howDidYouHearAboutUsSourceInput")
        );
        userEvent.click(await screen.findByText("Facebook"));

        userEvent.click(await screen.findByTestId("pibCaseNumberInput"));
        userEvent.type(screen.getByTestId("pibCaseNumberInput"), "76960");

        userEvent.click(screen.getByTestId("saveIncidentDetailsButton"));

        expect(
          await screen.findByText("Incident details were successfully updated")
        ).toBeInTheDocument();
      });
    });
  }
);
