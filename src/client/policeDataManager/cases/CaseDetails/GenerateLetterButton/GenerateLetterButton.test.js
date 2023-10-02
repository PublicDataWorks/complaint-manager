import React from "react";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import nock from "nock";
import GenerateLetterButton from "./GenerateLetterButton";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { push } from "connected-react-router";
import "@testing-library/jest-dom";

describe("GenerateLetterButton", () => {
  let store, responseBody, dispatchSpy, caseId;

  beforeEach(() => {
    store = createConfiguredStore();
    nock.cleanAll();

    caseId = 1;
    responseBody = [
      {
        id: 1,
        type: "REFERRAL",
        template: "<section>Hello World</section>",
        hasEditPage: true,
        requiresApproval: true,
        defaultSender: {
          name: "Billy",
          nickname: "bill@billy.bil"
        },
        requiredStatus: "Active"
      },
      {
        id: 2,
        type: "COMPLAINANT",
        template: "",
        editableTemplate: "editable template",
        hasEditPage: true,
        requiresApproval: null,
        defaultSender: {
          name: "Kate",
          nickname: "Kate@k.com"
        },
        requiredStatus: "Initial"
      },
      {
        id: 3,
        type: "Test Letter Type",
        template: "This is the letter template",
        editableTemplate: "editable template",
        hasEditPage: true,
        requiresApproval: null,
        defaultSender: {
          name: "Kate",
          nickname: "Kate@k.com"
        },
        requiredStatus: "Initial"
      }
    ];
    dispatchSpy = jest.spyOn(store, "dispatch");

    nock("http://localhost").get("/api/letter-types").reply(200, responseBody);
    render(
      <Provider store={store}>
        <Router>
          <GenerateLetterButton caseId={caseId} />
        </Router>
      </Provider>
    );
  });

  test("should show list of letter types on click", async () => {
    userEvent.click(screen.getByText("Generate Letter"));
    expect(
      await screen.findByTestId(`${responseBody[0].type}-option`)
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId(`${responseBody[1].type}-option`)
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId(`${responseBody[2].type}-option`)
    ).toBeInTheDocument();
  });

  test("should redirect to Letter Preview Page if letter type is editable", async () => {
    const knock = nock("http://localhost")
      .post(`/api/cases/${caseId}/letters`, { type: "REFERRAL" })
      .reply(200, { id: 1 });
    userEvent.click(screen.getByText("Generate Letter"));
    userEvent.click(await screen.findByText("REFERRAL"));
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (knock.isDone()) {
          resolve();
        } else {
          reject(
            "Service call to /api/cases/${caseId}/letters was not made within 500ms"
          );
        }
      }, 500);
    });
    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseId}/letter/1/letter-preview`)
    );
  });
});
