import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import { NO_CASE_TAGS, setUpCaseDetailsPage } from "./case-details-helper";

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

    describe("case tags", () => {
      test("should add an existing tag to a case", async () => {
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
      });

      test.todo("should add a new tag to a case");
      test.todo("should remove a tag from a case");
    });
  }
);
