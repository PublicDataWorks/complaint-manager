import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import {
  NO_CASE_TAGS,
  CHANGES_SEARCHABLE_DATA,
  setUpCaseDetailsPage
} from "./case-details-helper";
import "@testing-library/jest-dom";

describe("case tags", () => {
  /*  here's why there's an array:
   *  pactWith has a bug where you can't override the timeout, which sometimes necessitates
   *  splitting the test cases into separate pactWith blocks.  In order to preserve the case tags
   *  describe as the parent of all the tests, we put it outside the pactWith and then put to tests
   *  in an array with the keys description and test, description being the first argument to the
   *  test wrapper and test being a function that takes the provider created by pactWith and returns
   *  a function that serves as the second argument to the test wrapper, thus <code>test(scenario.description, scenario.test(provider));</code>
   *  is called in each loop of the forEach, so to add another test here, simply add an object to the array directly below in this form:
   *  {
   *    description: "a string describing the test",
   *    test: provider => async () => {
   *      <code for the test>
   *    }
   *  }
   */
  [
    {
      description: "should add an existing tag to a case",
      test: provider => async () => {
        const { unmount } = await setUpCaseDetailsPage(
          provider,
          NO_CASE_TAGS,
          CHANGES_SEARCHABLE_DATA
        );
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

        let findTagResult,
          counter = 0;
        do {
          userEvent.click(await screen.findByTestId("caseTagDropdownInput"));
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              findTagResult = screen.queryByText("mardi gras");
              resolve();
            }, 500);
            counter++;
          });
        } while (!findTagResult && counter < 40);

        userEvent.type(
          await screen.findByTestId("caseTagDropdownInput"),
          "mardi gras"
        );
        userEvent.click(screen.getByTestId("caseTagSubmitButton"));
        const newTag = await screen.findByTestId("caseTagChip", {
          timeout: 8000
        });

        expect(newTag.textContent).toEqual("mardi gras");
        expect(
          await screen.findByText("Case tag was successfully added")
        ).toBeInTheDocument();

        unmount();
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    },
    {
      description: "should add a new tag to a case",
      test: provider => async () => {
        const { unmount } = await setUpCaseDetailsPage(
          provider,
          NO_CASE_TAGS,
          CHANGES_SEARCHABLE_DATA
        );
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
        expect(
          await screen.findByText("Case tag was successfully added")
        ).toBeInTheDocument();

        unmount();
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    },
    {
      description: "should remove a tag from a case",
      test: provider => async () => {
        const { unmount } = await setUpCaseDetailsPage(
          provider,
          CHANGES_SEARCHABLE_DATA
        );
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

        const tagChip = await screen.findByTestId("caseTagChip");
        const deleteIcon = tagChip.getElementsByTagName("svg");
        fireEvent.click(deleteIcon[0]);
        userEvent.click(await screen.findByTestId("removeCaseTag"));

        expect(
          await screen.findByText("Case tag was successfully removed")
        ).toBeInTheDocument();

        unmount();
        await new Promise(resolve => setTimeout(resolve, 10));
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
