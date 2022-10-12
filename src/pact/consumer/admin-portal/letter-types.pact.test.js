import { screen } from "@testing-library/react";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import userEvent from "@testing-library/user-event";
import { setupAdminPortal } from "./admin-portal-helper";

jest.useRealTimers();
jest.mock("../../../client/policeDataManager/shared/components/FileUpload");

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

    describe("letter types", () => {
      beforeEach(async () => {
        await setupAdminPortal(provider);
        await Promise.all([
          screen.findByText("REFERRAL"),
          screen.findByText("Nina Ambroise"),
          screen.findByText("Initial")
        ]);
      });

      test("should show letter types saved in the database", async () => {
        userEvent.click(await screen.findByText("REFERRAL"));
        await Promise.all([screen.findByText("Template")]);
      }, 100000);

      test("should delete letter type after delete is selected and confirmed", async () => {
        await provider.addInteraction({
          state: "letter types have been added to the database",
          uponReceiving: "delete letter type",
          withRequest: {
            method: "DELETE",
            path: "/api/letter-types/1"
          },
          willRespondWith: {
            status: 204
          }
        });

        userEvent.click(await screen.findByTestId("delete-letter-type-btn"));
        userEvent.click(await screen.findByTestId("dialog-confirm-button"));
        expect(await screen.findByText("Letter type successfully deleted"))
          .toBeInTheDocument;
      }, 100000);
    });
  }
);
