import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import "@testing-library/jest-dom";
import CaseNotes from "../../../client/policeDataManager/cases/CaseDetails/CaseNotes/CaseNotes";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../client/createConfiguredStore";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import { getCaseDetailsSuccess } from "../../../client/policeDataManager/actionCreators/casesActionCreators";
import SharedSnackbarContainer from "../../../client/policeDataManager/shared/components/SharedSnackbarContainer";

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
      test("should add a case note", async () => {
        await Promise.all([
          provider.addInteraction({
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
                caseNoteActionId: {
                  value: 1,
                  label: "Case briefing from NOPD"
                },
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
          }),
          provider.addInteraction({
            state: "case note actions exist",
            uponReceiving: "get case note actions",
            withRequest: {
              method: "GET",
              path: "/api/case-note-actions"
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              },
              body: eachLike(["Case briefing from NOPD", 1])
            }
          }),
          provider.addInteraction({
            state: "users exist in the store",
            uponReceiving: "get users",
            withRequest: {
              method: "GET",
              path: "/api/users"
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              },
              body: eachLike({
                email: "anna.banana@gmail.com",
                name: "Anna Banana"
              })
            }
          }),
          provider.addInteraction({
            state: "case has a case note",
            uponReceiving: "get case notes",
            withRequest: {
              method: "GET",
              path: "/api/cases/1/case-notes"
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              },
              body: eachLike({
                id: 1,
                actionTakenAt: "2022-08-22T15:56:00.000Z",
                notes: "test",
                createdAt: "2022-08-22T15:58:21.394Z",
                updatedAt: "2022-08-22T15:58:21.394Z",
                actionId: 8,
                caseId: 1,
                caseNoteActionId: 8,
                caseNoteAction: {
                  id: 8,
                  name: "Memo to file",
                  createdAt: "2022-08-19T16:45:03.710Z",
                  updatedAt: "2022-08-19T16:45:03.710Z"
                },
                author: {
                  name: "NOIPM Infra",
                  email: "noipm.infrastructure@gmail.com"
                }
              })
            }
          })
        ]);

        let store = createConfiguredStore();
        store.dispatch(getCaseDetailsSuccess({ id: 1 }));
        store.dispatch({
          type: "AUTH_SUCCESS",
          userInfo: {
            permissions: [
              USER_PERMISSIONS.CREATE_CASE_NOTE,
              USER_PERMISSIONS.EDIT_CASE,
              USER_PERMISSIONS.ADD_TAG_TO_CASE
            ]
          }
        });
        render(
          <Provider store={store}>
            <CaseNotes caseId={1} />
            <SharedSnackbarContainer />
          </Provider>
        );

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
