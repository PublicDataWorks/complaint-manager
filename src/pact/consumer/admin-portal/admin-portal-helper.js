import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { like, eachLike } from "@pact-foundation/pact/src/dsl/matchers";
import createConfiguredStore from "../../../client/createConfiguredStore";
import SharedSnackbarContainer from "../../../client/policeDataManager/shared/components/SharedSnackbarContainer";
import AdminPortal from "../../../client/policeDataManager/admin/AdminPortal";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";

export const setupAdminPortal = async provider => {
  await provider.addInteraction({
    state: "case statuses exist",
    uponReceiving: "get case statuses",
    withRequest: {
      method: "GET",
      path: "/api/case-statuses"
    },
    willRespondWith: {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: eachLike({
        id: 1,
        name: "Initial",
        orderKey: 0
      })
    }
  });

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
        template: `<html>
          <head>
            <style>* { font-size: 8.5pt; }</style>
          </head>
          <body>
            <div id="pageHeader-first">
              <div style="text-align: center;">{{{header}}}</div>
            </div>
            <div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;">{{{referralLetter.recipient}}}<br/>{{{formatLongDate currentDate}}}<br/>Page \{{page}}</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">{{{smallIcon}}}</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">
                INDEPENDENT POLICE MONITOR<br />
                2714 Canal Street, Suite 201 | NEW ORLEANS, LOUISIANA | 70119 <br />
                Phone (504) 309-9799| Fax (504) 309-7345
              </span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            <p>Template</p>
          </body>
        </html>`,
        hasEditPage: false,
        requiresApproval: false,
        requiredStatus: "Initial",
        defaultSender: {
          name: "Nina Ambroise",
          nickname: "Amrose@place.com"
        }
      })
    }
  });

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
          },
          {
            rel: "delete",
            href: "/api/signers/1",
            method: "delete"
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
};
