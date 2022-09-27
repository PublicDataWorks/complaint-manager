import { screen } from "@testing-library/react";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
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

    describe("Admin Portal", () => {
      beforeEach(async () => {
        await setupAdminPortal(provider);
      });

      describe("letter types", () => {
        test("should show letter types saved in the database", async () => {
          await Promise.all([
            screen.findByText("REFERRAL"),
            screen.findByText("Billy"),
            screen.findByText("Initial")
          ]);
          userEvent.click(await screen.findByText("REFERRAL"));
          await Promise.all([screen.findByText("Template")]);
        }, 100000);
      });
    });
  }
);
