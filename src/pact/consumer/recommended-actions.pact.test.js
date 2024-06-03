import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike, like } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import RecommendedActions from "../../client/policeDataManager/cases/ReferralLetter/RecommendedActions/RecommendedActions";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";

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

    describe("recommended actions page", () => {
      beforeEach(async () => {
        await provider.addInteraction({
          state: "letter is ready for review: with civilian complainant",
          uponReceiving: "get case details",
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
              id: 1,
              caseReference: "CC2022-0003",
              status: "Letter in Progress",
              complainantCivilians: eachLike({
                fullName: "Martha Stewart"
              }),
              complainantOfficers: eachLike({
                id: 1,
                caseEmployeeType: "Officer",
                isUnknownOfficer: false,
                fullName: "Karen Tuti",
                employeeId: 345,
                district: "5th District"
              }),
              accusedOfficers: [],
              witnessCivilians: [],
              witnessOfficers: []
            })
          }
        });

        await provider.addInteraction({
          state: "letter is ready for review: officer history added",
          uponReceiving: "get referral letter details",
          withRequest: {
            method: "GET",
            path: "/api/cases/1/referral-letter"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({
              id: 1,
              caseId: 1,
              letterOfficers: eachLike({
                caseOfficerId: 1,
                fullName: "Alexane C Barrows",
                id: 1,
                officerHistoryOptionId: "2",
                referralLetterOfficerRecommendedActions: [],
                referralLetterOfficerHistoryNotes: [
                  {
                    tempId: "oTJmUKFZbygoVA-hTYocZ"
                  }
                ]
              }),
              classifications: {}
            })
          }
        });

        await provider.addInteraction({
          state: "letter is ready for review",
          uponReceiving: "get letter edit status",
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
          state: "recommended actions are added",
          uponReceiving: "get recommended actions",
          withRequest: {
            method: "GET",
            path: "/api/recommended-actions"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: [
              {
                id: 1,
                description:
                  "Be temporarily or permanently reassigned from his/her current assignment"
              },
              {
                id: 2,
                description: "Receive training regarding any issues noted"
              },
              {
                id: 3,
                description:
                  "Receive supervisory interventions and monitoring - INSIGHT"
              },
              {
                id: 4,
                description: "Be subject to a Fitness for Duty Assessment"
              },
              {
                id: 5,
                description: "Be the subject of Integrity Checks"
              }
            ]
          }
        });

        await provider.addInteraction({
          state: "classifications are added",
          uponReceiving: "get classifications",
          withRequest: {
            method: "GET",
            path: "/api/classifications"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: [
              {
                name: "Use of Force",
                message:
                  "Due to the allegation of use of force, the OIPM recommends that this allegation be classified as use of force and be investigated by the Force Investigative Team (FIT).",
                id: 1
              },
              {
                name: "Criminal Misconduct",
                message:
                  "Due to the allegation of a possible commission of crime, false arrest, domestic violence, an unlawful search, or a civil rights violation, OIPM recommends this complaint be classified as criminal misconduct at this time.",
                id: 2
              },
              {
                name: "Serious Misconduct",
                message:
                  "Due to the allegation of possible discriminatory policing, false arrest, “planting of evidence,” untruthfulness / false statements, unlawful search, retaliation, sexual misconduct, domestic violence, or misconduct implicating the conduct of the supervisory or command leadership of the subject employee, OIPM recommends the complaint be classified as serious misconduct at this time.",
                id: 3
              },
              {
                name: "Declines to classify",
                message:
                  "OIPM declines to classify the complaint at this time.",
                id: 4
              }
            ]
          }
        });
      });

      test("should cancel out other classifications when Declines to classify is clicked", async () => {
        await provider.addInteraction({
          state: "letter is ready for review: officer history added",
          uponReceiving: "update classifications",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/classifications",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              id: 1,
              classifications: [null, null, null, 4]
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        await provider.addInteraction({
          state: "letter is ready for review: officer history added",
          uponReceiving: "update recommended actions",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/recommended-actions",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              id: 1,
              "csfn-1": false,
              "csfn-2": false,
              "csfn-3": false,
              "csfn-4": true,
              includeRetaliationConcerns: true,
              letterOfficers: [
                {
                  "action-2": true,
                  caseOfficerId: 1,
                  fullName: "Alexane C Barrows",
                  id: 1,
                  officerHistoryOptionId: "2",
                  referralLetterOfficerRecommendedActions: [2],
                  referralLetterOfficerHistoryNotes: [
                    {
                      tempId: "oTJmUKFZbygoVA-hTYocZ"
                    }
                  ]
                }
              ]
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        render(
          <Provider store={createConfiguredStore()}>
            <Router>
              <RecommendedActions match={{ params: { id: "1" } }} />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        userEvent.click(
          await screen.findByTestId("include-retaliation-concerns-field")
        );
        userEvent.click(await screen.findByTestId("use-of-force"));
        userEvent.click(screen.getByTestId("criminal-misconduct"));
        userEvent.click(screen.getByTestId("declines-to-classify"));
        userEvent.click(screen.getByTestId("letterOfficers[0]-2"));
        userEvent.click(screen.getByTestId("next-button"));

        const snackbar = await screen.findByTestId("sharedSnackbarBannerText");
        expect(snackbar.textContent).toInclude("successfully updated");
      });

      test("should submit with multiple classifications and recommended actions", async () => {
        await provider.addInteraction({
          state: "letter is ready for review: officer history added",
          uponReceiving: "update multiple classifications",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/classifications",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              id: 1,
              classifications: [1, null, 3, null]
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        await provider.addInteraction({
          state: "letter is ready for review: officer history added",
          uponReceiving: "update multiple recommended actions",
          withRequest: {
            method: "PUT",
            path: "/api/cases/1/referral-letter/recommended-actions",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              id: 1,
              "csfn-1": true,
              "csfn-3": true,
              letterOfficers: [
                {
                  "action-1": true,
                  "action-5": true,
                  caseOfficerId: 1,
                  fullName: "Alexane C Barrows",
                  id: 1,
                  officerHistoryOptionId: "2",
                  referralLetterOfficerRecommendedActions: [1, 5],
                  referralLetterOfficerHistoryNotes: [
                    {
                      tempId: "oTJmUKFZbygoVA-hTYocZ"
                    }
                  ]
                }
              ]
            }
          },
          willRespondWith: {
            status: 200
          }
        });

        render(
          <Provider store={createConfiguredStore()}>
            <Router>
              <RecommendedActions match={{ params: { id: "1" } }} />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );

        userEvent.click(await screen.findByTestId("use-of-force"));
        userEvent.click(screen.getByTestId("serious-misconduct"));
        userEvent.click(await screen.findByTestId("letterOfficers[0]-1"));
        userEvent.click(screen.getByTestId("letterOfficers[0]-5"));
        userEvent.click(screen.getByTestId("next-button"));

        const snackbar = await screen.findByTestId("sharedSnackbarBannerText");
        expect(snackbar.textContent).toInclude("successfully updated");
      });
    });
  }
);
