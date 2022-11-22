import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import { NO_CASE_TAGS, setUpCaseDetailsPage } from "./case-details-helper";
import { resolve } from "path";
import { reject } from "lodash";

describe("case tags", () => {
  [
    {
      description: "should add an existing tag to a case",
      test: provider => async () => {
        await setUpCaseDetailsPage(provider, NO_CASE_TAGS);
        await provider.addInteraction({
          state: "Case exists: tags exist",
          uponReceiving: "add existing case tag",
          withRequest: {
            method: "POST",
            path: "/api/cases/1/case-tags",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              tagId: 1
            }
          },
          willRespondWith: {
            status: 200,
            body: {
              caseTags: eachLike({
                id: 3221,
                caseId: 1,
                tagId: 284,
                tag: {
                  id: 1,
                  name: "mardi gras"
                }
              }),
              tags: eachLike({
                name: "mardi gras",
                id: 1
              })
            }
          }
        });

        userEvent.click(await screen.findByTestId("addTagButton"));
        userEvent.type(
          await screen.findByTestId("caseTagDropdownInput"),
          "mardi gras"
        );
        userEvent.click(screen.getByTestId("caseTagSubmitButton"));
        const newTag = await screen.findByTestId("caseTagChip");

        expect(newTag.textContent).toEqual("mardi gras");
        expect(await screen.findByText("Case tag was successfully added"))
          .toBeInTheDocument;
      }
    },
    {
      description: "should add a new tag to a case",
      test: provider => async () => {
        await setUpCaseDetailsPage(provider, NO_CASE_TAGS);
        await provider.addInteraction({
          state: "Case exists",
          uponReceiving: "add new case tag",
          withRequest: {
            method: "POST",
            path: "/api/cases/1/case-tags",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              tagName: "apple pie"
            }
          },
          willRespondWith: {
            status: 200,
            body: {
              caseTags: eachLike({
                id: 3221,
                caseId: 1,
                tagId: 284,
                tag: {
                  id: 1,
                  name: "apple pie"
                }
              }),
              tags: eachLike({
                name: "apple pie",
                id: 1
              })
            }
          }
        });

        userEvent.click(await screen.findByTestId("addTagButton"));
        userEvent.type(
          await screen.findByTestId("caseTagDropdownInput"),
          "apple pie"
        );
        userEvent.click(screen.getByTestId("caseTagSubmitButton"));
        const newTag = await screen.findByTestId("caseTagChip");

        expect(newTag.textContent).toEqual("apple pie");
        expect(await screen.findByText("Case tag was successfully added"))
          .toBeInTheDocument;
      }
    },
    {
      description: "should remove a tag from a case",
      test: provider => async () => {
        const results = await setUpCaseDetailsPage(provider);
        await provider.addInteraction({
          state: "case has a case tag",
          uponReceiving: "remove case tag",
          withRequest: {
            method: "DELETE",
            path: "/api/cases/1/case-tags/1"
          },
          willRespondWith: {
            status: 200
          }
        });

        // const deleteIcon = await new Promise((resolve, reject) => {
        //   let result = results.container.querySelector(".MuiChip-deleteIcon");
        //   for (let i = 0; i < 50 && !result; i++) {
        //     setTimeout(() => {
        //       result = results.container.querySelector(".MuiChip-deleteIcon");
        //     }, 500);
        //   }
        //   resolve(result);
        // });

        // console.log(deleteIcon);

        const tagChip = await screen.findByTestId("caseTagChip");
        const deleteIcon = tagChip.getElementsByTagName("svg");
        console.log(deleteIcon);
        fireEvent.click(deleteIcon[0]);
        userEvent.click(await screen.findByTestId("removeCaseTag"));

        expect(await screen.findByText("Case tag was successfully removed"))
          .toBeInTheDocument;
      }
    }
  ].forEach(scenario => {
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

        test(scenario.description, scenario.test(provider));
      }
    );
  });
});
