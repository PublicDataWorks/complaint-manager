import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import { setUpCaseDetailsPage } from "./case-details-helper";
import "@testing-library/jest-dom";

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

    describe("case notes", () => {
      beforeEach(async () => await setUpCaseDetailsPage(provider));
      test("should add a case note", async () => {
        await provider.addInteraction({
          state: "Case exists; case note actions exist",
          uponReceiving: "add case note",
          withRequest: {
            method: "POST",
            path: "/api/cases/1/case-notes",
            headers: {
              "Content-Type": "application/json"
            },
            body: like({
              caseId: 1,
              caseNoteActionId: { value: 1, label: "Case briefing from NOPD" },
              notes: "i wrote notes",
              mentionedUsers: [],
              actionTakenAt: "2022-08-24T11:29:00-06:00"
            })
          },
          willRespondWith: {
            status: 201,
            body: like({
              caseNotes: eachLike({
                id: 1,
                actionTakenAt: "2022-08-22T15:56:00.000Z",
                notes: "test",
                createdAt: "2022-08-22T15:58:21.394Z",
                updatedAt: "2022-08-22T15:58:21.394Z",
                actionId: 1,
                caseId: 1,
                caseNoteActionId: 1,
                caseNoteAction: {
                  id: 1,
                  name: "Case briefing from NOPD",
                  createdAt: "2022-08-19T16:45:03.710Z",
                  updatedAt: "2022-08-19T16:45:03.710Z"
                },
                author: {
                  name: "NOIPM Infra",
                  email: "noipm.infrastructure@gmail.com"
                }
              }),
              caseDetails: {
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
              }
            })
          }
        });

        expect(
          await screen.findByTestId("caseNotesContainer")
        ).toBeInTheDocument();

        const addButton = screen.getByTestId("addCaseNoteButton");

        userEvent.click(addButton);
        userEvent.click(await screen.findByTestId("actionTakenInput"));
        userEvent.click(await screen.findByText("Case briefing from NOPD"));

        userEvent.click(screen.getByTestId("notesInput"));
        userEvent.type(screen.getByTestId("notesInput"), "i wrote notes");
        userEvent.click(screen.getByTestId("submitButton"));

        expect(
          await screen.findByText("Case note was successfully created")
        ).toBeInTheDocument();
      });
    });
  }
);
