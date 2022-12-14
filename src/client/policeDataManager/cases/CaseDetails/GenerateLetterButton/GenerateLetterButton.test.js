import React from "react";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import nock from "nock";
import GenerateLetterButton from "./GenerateLetterButton";
import userEvent from "@testing-library/user-event";

describe("GenerateLetterButton", () => {
  let store, responseBody;

  beforeEach(() => {
    store = createConfiguredStore();
    nock.cleanAll();

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

    nock("http://localhost").get("/api/letter-types").reply(200, responseBody);
  });

  test("should show list of letter types on click", async () => {
    render(
      <Provider store={store}>
        <GenerateLetterButton />
      </Provider>
    );

    userEvent.click(screen.getByText("Generate Letter"));
    expect(await screen.findByTestId(`${responseBody[0].type}-option`))
      .toBeInTheDocument;
    expect(await screen.findByTestId(`${responseBody[1].type}-option`))
      .toBeInTheDocument;
    expect(await screen.findByTestId(`${responseBody[2].type}-option`))
      .toBeInTheDocument;
  });
});
