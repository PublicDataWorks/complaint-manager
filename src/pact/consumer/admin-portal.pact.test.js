import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";
import { pactWith } from "jest-pact";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import AdminPortal from "../../client/policeDataManager/admin/AdminPortal";
import { USER_PERMISSIONS } from "../../sharedUtilities/constants";

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
        await provider.addInteraction({
          state: "signers have been added to the database",
          uponReceiving: "get signers",
          withRequest: {
            method: "GET",
            path: "/api/signers"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: eachLike({
              id: 1,
              name: "John A Simms",
              title: "Independent Police Monitor",
              nickname: "jsimms@oipm.gov",
              phone: "888-576-9922",
              links: [
                {
                  rel: "signature",
                  href: "/api/signers/1/signature"
                }
              ]
            })
          }
        });

        await provider.addInteraction({
          state: "signers have been added to the database",
          uponReceiving: "get signature",
          withRequest: {
            method: "GET",
            path: "/api/signers/1/signature"
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "image/png"
            },
            body: like(Buffer.from("bytes", "base64").toString("base64"))
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
              <AdminPortal />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );
      });

      test("should show signatures saved in the database", async () => {
        await Promise.all([
          screen.findByText("John A Simms"),
          screen.findByText("888-576-9922"),
          screen.findByText("Independent Police Monitor")
        ]);

        await screen.findByAltText("The signature of John A Simms");
      });
    });
  }
);
