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

    describe("Admin Portal", () => {
      beforeEach(async () => {
        await setupAdminPortal(provider);
      });

      describe("letter types", () => {
        test("should show letter types saved in the database", async () => {
          await Promise.all([
            screen.findByText("REFERRAL"),
            screen.findByText("Nina Ambroise"),
            screen.findByText("Initial")
          ]);
          userEvent.click(await screen.findByText("REFERRAL"));
          await Promise.all([screen.findByText("Template")]);
        }, 100000);

        test("should update and display letter type upon editing", async () => {
          await provider.addInteraction({
            state: "letter types have been added to the database",
            uponReceiving: "edit letter type",
            withRequest: {
              method: "PUT",
              path: "/api/letter-types/1",
              headers: { "Content-Type": "application/json" },
              body: {
                type: "LETTER",
                template: "<p>TEMPLATE</p>",
                hasEditPage: false,
                requiresApproval: true,
                requiredStatus: "Initial",
                defaultSender: "Amrose@place.com"
              }
            },
            willRespondWith: {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              },
              body: like({
                id: 1,
                type: "LETTER",
                template: "TEMPLATE",
                hasEditPage: false,
                requiresApproval: true,
                requiredStatus: "Initial",
                defaultSender: {
                  name: "Nina Ambroise",
                  nickname: "Amrose@place.com"
                }
              })
            }
          });

          await screen.findByText("REFERRAL");
          userEvent.click(await screen.findByTestId("edit-letter-type-btn"));

          await screen.findByText("Edit Letter Type");
          userEvent.click(screen.getByTestId("letter-type-input"));
          userEvent.clear(screen.getByTestId("letter-type-input"));
          userEvent.type(screen.getByTestId("letter-type-input"), "LETTER");

          userEvent.click(screen.getByTestId("requires-approval-checkbox"));
          userEvent.click(screen.getByText("Save"));

          expect(await screen.findByText("Successfully edited letter type"))
            .toBeInTheDocument;
          expect(await screen.findByText("LETTER")).toBeInTheDocument;
        });
      });
    });
  }
);
