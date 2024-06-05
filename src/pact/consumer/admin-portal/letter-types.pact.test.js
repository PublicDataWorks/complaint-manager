import { screen } from "@testing-library/react";
import axios from "axios";
import { pactWith } from "jest-pact";
import { eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import userEvent from "@testing-library/user-event";
import { setupAdminPortal } from "./admin-portal-helper";
import "@testing-library/jest-dom";
import { FAKE_USERS } from "../../../sharedUtilities/constants";

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
        await provider.addInteraction({
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
            body: eachLike(FAKE_USERS[0])
          }
        });
        await setupAdminPortal(provider);
        await Promise.all([
          screen.findByText("REFERRAL"),
          screen.findByText("Nina Ambroise"),
          screen.findByText("Initial")
        ]);
      });

      test("should show letter types saved in the database", async () => {
        userEvent.click(await screen.findByText("REFERRAL"));
        await Promise.all([screen.findAllByText("Template")]);
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
        expect(
          await screen.findByText("Letter type successfully deleted")
        ).toBeInTheDocument();
      }, 100000);
    });
  }
);
