import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import AllegationSearchContainer from "../../client/policeDataManager/allegations/AllegationSearchContainer";
import { GET_CASE_DETAILS_SUCCESS } from "../../sharedUtilities/constants";

jest.mock("../../client/policeDataManager/shared/components/FileUpload");

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

    describe("Allegation Search", () => {
      beforeEach(async () => {
        await provider.addInteraction({
          state: "allegations have been added to the database",
          uponReceiving: "get allegations",
          withRequest: {
            method: "GET",
            path: "/api/allegations"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              rule: "RULE 2: MORAL CONDUCT",
              paragraphs: eachLike("PARAGRAPH 01 - ADHERENCE TO THE LAW")
            })
          }
        });

        await provider.addInteraction({
          state: "chapters have been added to the database",
          uponReceiving: "get rule chapter",
          withRequest: {
            method: "GET",
            path: "/api/rule-chapters"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              id: 1,
              name: "Ch. 1.2 Disclosure Obligations"
            })
          }
        });

        await provider.addInteraction({
          state: "directives have been added to the database",
          uponReceiving: "get directives",
          withRequest: {
            method: "GET",
            path: "/api/directives"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              id: 1,
              name: "R.S. 1234 - Crime is frowned upon, especially when committed by police officers"
            })
          }
        });

        let store = createConfiguredStore();
        store.dispatch({
          type: GET_CASE_DETAILS_SUCCESS,
          caseDetails: {
            id: 1,
            caseReference: "CC2022-0001",
            accusedOfficers: [
              {
                id: 1,
                fullName: "Bob Loblaw",
                windowsUserName: 1,
                rank: "Attorney",
                bureau: "Bob Loblaw's Law Blog",
                allegations: [
                  {
                    id: 1,
                    details: "Details!!!",
                    caseOfficerId: 1,
                    severity: "Low",
                    allegationId: 232,
                    ruleChapterId: 63,
                    allegation: {
                      id: 232,
                      rule: "RULE 4: PERFORMANCE OF DUTY",
                      paragraph:
                        "PARAGRAPH 04(c) - ENUMERATED ACTS/OMISSIONS; 1. Failing to take appropriate and necessary police action",
                      directive: "N/A"
                    }
                  }
                ]
              }
            ]
          }
        });
        render(
          <Provider store={store}>
            <Router>
              <AllegationSearchContainer
                match={{ params: { id: "1", caseOfficerId: "1" } }}
              />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );
      });

      test("should search for and add allegations to officers", async () => {
        await provider.addInteraction({
          state: "allegations have been added to the database",
          uponReceiving: "search allegations",
          withRequest: {
            method: "GET",
            path: "/api/allegations/search",
            query: {
              rule: "RULE 2: MORAL CONDUCT"
            }
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              count: 1,
              rows: eachLike({
                id: 1,
                rule: "RULE 2: MORAL CONDUCT",
                paragraph: "PARAGRAPH 01 - ADHERENCE TO THE LAW"
              })
            })
          }
        });

        await provider.addInteraction({
          state: "case has accused officer: allegations exist",
          uponReceiving: "add officer allegation",
          withRequest: {
            method: "POST",
            path: "/api/cases/1/cases-officers/1/officers-allegations",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              allegationId: 1,
              details: "Whoa man, very medium",
              ruleChapterId: 1,
              severity: "Medium"
            }
          },
          willRespondWith: {
            status: 201,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              id: 1,
              caseReference: "CC2022-0001",
              accusedOfficers: eachLike({
                id: 1,
                windowsUsername: 1,
                rank: "Attorney",
                bureau: "Bob Loblaw's Law Blog",
                fullName: "Bob Loblaw",
                allegations: eachLike({
                  id: 1,
                  details: "Whoa man, very medium",
                  caseOfficerId: 1,
                  severity: "Medium",
                  allegationId: 1,
                  allegation: {
                    id: 1,
                    rule: "RULE 2: MORAL CONDUCT",
                    paragraph: "PARAGRAPH 01 - ADHERENCE TO THE LAW",
                    directive: "1.1 Directive"
                  },
                  ruleChapter: {
                    id: 1,
                    name: "Ch. 1.2 Disclosure Obligations"
                  }
                })
              })
            })
          }
        });

        userEvent.click(await screen.findByTestId("ruleInput"));
        userEvent.click(await screen.findByText("Rule 2: Moral Conduct"));
        userEvent.click(screen.getByTestId("allegationSearchSubmitButton"));
        const selectBtns = await screen.findAllByTestId(
          "selectAllegationButton"
        );
        userEvent.click(selectBtns[0]);
        userEvent.click(await screen.findByTestId("rule-chapter-input"));
        userEvent.click(
          await screen.findByText("Ch. 1.2 Disclosure Obligations")
        );
        userEvent.click(await screen.findByTestId("allegation-severity-input"));
        userEvent.click(await screen.findByText("Medium"));
        userEvent.type(
          screen.getByTestId("allegation-details-input"),
          "Whoa man, very medium"
        );
        userEvent.click(screen.getByText("Add Allegation"));
        expect(
          await screen.findByTestId("editAllegationButton")
        ).toBeInTheDocument();
      });

      test("should update officer allegation", async () => {
        await provider.addInteraction({
          state: "Case exists: case has accused officer with allegations",
          uponReceiving: "edit officer allegation",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/officers-allegations/1",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              id: 1,
              details: "Whoa man, very medium",
              ruleChapterId: 1,
              directiveName: "New Directive",
              severity: "Medium"
            }
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              id: 1,
              caseReference: "CC2022-0001",
              accusedOfficers: eachLike({
                id: 1,
                windowsUsername: 1,
                rank: "Attorney",
                bureau: "Bob Loblaw's Law Blog",
                fullName: "Bob Loblaw",
                allegations: eachLike({
                  id: 1,
                  details: "Whoa man, very medium",
                  caseOfficerId: 1,
                  severity: "Medium",
                  allegationId: 1,
                  allegation: {
                    id: 1,
                    rule: "RULE 2: MORAL CONDUCT",
                    paragraph: "PARAGRAPH 01 - ADHERENCE TO THE LAW",
                    directive: "1.1 Directive"
                  },
                  ruleChapter: {
                    id: 1,
                    name: "Ch. 1.2 Disclosure Obligations"
                  },
                  directive: {
                    name: "New Directive"
                  }
                })
              })
            })
          }
        });

        userEvent.click(await screen.findByTestId("editAllegationButton"));
        userEvent.click(await screen.findByTestId("rule-chapter-input"));
        userEvent.click(
          await screen.findByText("Ch. 1.2 Disclosure Obligations")
        );

        userEvent.type(
          await screen.findByTestId("directive-input"),
          "New Directive"
        );

        userEvent.click(await screen.findByTestId("allegation-severity-input"));
        userEvent.click(await screen.findByText("Medium"));
        userEvent.clear(screen.getByTestId("allegation-details-input"));
        userEvent.type(
          screen.getByTestId("allegation-details-input"),
          "Whoa man, very medium"
        );
        userEvent.click(await screen.findByTestId("allegation-submit-btn"));
        expect(
          await screen.findByText("Allegation was successfully updated")
        ).toBeInTheDocument();
      });
    });
  }
);
