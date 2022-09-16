import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import userEvent from "@testing-library/user-event";
import { USER_PERMISSIONS, FAKE_USERS } from "../../sharedUtilities/constants";
import moment from "moment";
import CustomConfigPage from "../../client/policeDataManager/customConfigPage/CustomConfigPage";

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

    describe("configuration page", () => {
      beforeEach(async () => {
        await provider.addInteraction({
          state: "letter types have been added to the database",
          uponReceiving: "get letter types",
          withRequest: {
            method: "GET",
            path: "/api/letter-types"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              id: 1,
              type: "REFERRAL",
              template: "TEMPLATE",
              hasEditPage: null,
              requiresApproval: null,
              requiredStatus: {
                name: "Initial"
              },
              defaultSender: {
                name: "Billy"
              }
            })
          }
        });

        let store = createConfiguredStore();
        store.dispatch({
          type: "AUTH_SUCCESS",
          userInfo: { permissions: [USER_PERMISSIONS.ADMIN_ACCESS] }
        });

        render(
          <Provider store={store}>
            <Router>
              <CustomConfigPage />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );
      });

      describe("letter types", () => {
        test("should show letter types saved in the database", async () => {
          await Promise.all([
            screen.findByText("REFERRAL"),
            screen.findByText("Billy"),
            screen.findByText("Initial")
          ]);
          userEvent.click(screen.getByTestId("letter-type-label"));
          await Promise.all([screen.findByText("TEMPLATE")]);
        });
      });
    });
  }
);
