import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import CaseDetails from "../../client/policeDataManager/cases/CaseDetails/CaseDetails";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import createConfiguredStore from "../../client/createConfiguredStore";
import { USER_PERMISSIONS } from "../../sharedUtilities/constants";

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

    describe("case details page", () => {
      beforeEach(async () => {
        await provider.addInteraction({
          state: "Case exists",
          uponReceiving: "get case",
          withRequest: {
            method: "GET",
            path: "/api/cases/1"
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

        await provider.addInteraction({
          state: "letter is ready for review",
          uponReceiving: "get letter review status",
          withRequest: {
            method: "GET",
            path: "/api/cases/1/referral-letter/edit-status"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              editStatus: "Generated"
            })
          }
        });

        await provider.addInteraction({
          state: "race ethnicities exist",
          uponReceiving: "get race ethnicities",
          withRequest: {
            method: "GET",
            path: "/api/race-ethnicities"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike(["American Indian or Alaska Native", 2])
          }
        });

        await provider.addInteraction({
          state: "districts exist",
          uponReceiving: "get districts",
          withRequest: {
            method: "GET",
            path: "/api/districts"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike(["1st District", 1])
          }
        });

        await provider.addInteraction({
          state: "civilian-titles exist",
          uponReceiving: "get civilian-titles",
          withRequest: {
            method: "GET",
            path: "/api/civilian-titles"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike(["N/A", 1])
          }
        });

        await provider.addInteraction({
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
        });

        await provider.addInteraction({
          state: "case has a case tag",
          uponReceiving: "get case tags",
          withRequest: {
            method: "GET",
            path: "/api/cases/1/case-tags"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              id: 2678,
              createdAt: "2022-05-02T18:53:25.798Z",
              updatedAt: "2022-05-02T18:53:25.798Z",
              caseId: 3541,
              tagId: 284,
              tag: {
                id: 284,
                name: "mardi gras",
                createdAt: "2022-05-02T18:53:25.788Z",
                updatedAt: "2022-05-02T18:53:25.788Z"
              }
            })
          }
        });

        await provider.addInteraction({
          state: "intake sources exist",
          uponReceiving: "get intake sources",
          withRequest: {
            method: "GET",
            path: "/api/intake-sources"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike(["Email", 1])
          }
        });

        await provider.addInteraction({
          state: "case statuses exist",
          uponReceiving: "get case statuses",
          withRequest: {
            method: "GET",
            path: "/api/case-statuses"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              id: 1,
              name: "Initial",
              orderKey: 0
            })
          }
        });

        await provider.addInteraction({
          state: "how did you hear about us sources exist",
          uponReceiving: "get how did you hear about us sources",
          withRequest: {
            method: "GET",
            path: "/api/how-did-you-hear-about-us-sources"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike(["Facebook", 1])
          }
        });

        await provider.addInteraction({
          state: "tags exist",
          uponReceiving: "get tags",
          withRequest: {
            method: "GET",
            path: "/api/tags"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              name: "mardi gras",
              id: 284
            })
          }
        });

        await provider.addInteraction({
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
        });

        await provider.addInteraction({
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
        });

        await provider.addInteraction({
          state: "gender identities exist",
          uponReceiving: "get gender idenities",
          withRequest: {
            method: "GET",
            path: "/api/gender-identities"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike(["Male", 1])
          }
        });

        let store = createConfiguredStore();

        store.dispatch({
          type: "AUTH_SUCCESS",
          userInfo: {
            permissions: [USER_PERMISSIONS.CREATE_CASE_NOTE]
          }
        });

        render(
          <Provider store={store}>
            <Router>
              <CaseDetails match={{ params: { id: "1" } }} />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );
      });

      describe("case notes", () => {
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
                caseNoteActionId: 1,
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
                    name: "Memo to file",
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

          expect(await screen.findByTestId("caseNotesContainer"))
            .toBeInTheDocument;

          const addButton = await screen.findByTestId("addCaseNoteButton");

          userEvent.click(addButton);
          userEvent.click(await screen.findByTestId("actionTakenInput"));
          userEvent.click(await screen.findByText("Case briefing from NOPD"));

          userEvent.click(screen.getByTestId("notesInput"));
          userEvent.type(screen.getByTestId("notesInput"), "i wrote notes");
          userEvent.click(screen.getByTestId("submitButton"));

          expect(await screen.findByText("Case note was successfully created"))
            .toBeInTheDocument;
        });
      });
    });
  }
);
