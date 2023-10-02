import axios from "axios";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { pactWith } from "jest-pact";
import {
  setUpCaseDetailsPage,
  GENERATE_LETTER_BUTTON
} from "./case-details-helper";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
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

    describe("generate letter button", () => {
      beforeEach(async () => {
        await setUpCaseDetailsPage(provider, GENERATE_LETTER_BUTTON);
      });

      test("should generate letter", async () => {
        await provider.addInteraction({
          state: "Case exists",
          uponReceiving: "generate letter",
          withRequest: {
            method: "POST",
            path: "/api/cases/1/letters",
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              type: "COMPLAINANT"
            }
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: like({ id: 1 })
          }
        });

        const generateLetterButton = await screen.findByTestId(
          "generate-letter-button"
        );

        userEvent.click(generateLetterButton);
        userEvent.click(await screen.findByText("COMPLAINANT"));

        expect(
          await screen.findByText("You have generated a new COMPLAINANT letter")
        ).toBeInTheDocument();
      });
    });
  }
);
