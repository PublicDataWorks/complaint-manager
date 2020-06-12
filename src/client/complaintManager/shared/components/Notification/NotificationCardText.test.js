import createConfiguredStore from "../../../../createConfiguredStore";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import NotificationCardText from "./NotificationCardText";
import React from "react";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import { wait } from "@testing-library/dom";
import "@testing-library/jest-dom";
import moment from "moment";

describe("unread notification text", () => {
  let newNotif;
  const renderNotificationText = newNotif => {
    const store = createConfiguredStore();
    const wrapper = render(
      <Provider store={store}>
        <Router>
          <NotificationCardText notification={newNotif} />
        </Router>
      </Provider>
    );
    return wrapper;
  };

  test("should see basic notification summary with author name", async () => {
    // ARRANGE
    newNotif = {
      user: "veronicablackwell@tw.com",
      updatedAt: "2020-03-19T18:57:31.953Z",
      caseReference: "AC2020-0004",
      author: { name: "Syd Botz", email: "sydbotz@gmail.com" }
    };
    const { queryByText } = renderNotificationText(newNotif);

    const expectedTime = moment(newNotif.updatedAt).format("MMM D h:mm A");

    // ASSERT
    await wait(() => {
      expect(
        queryByText("Syd Botz mentioned you in AC2020-0004")
      ).toBeInTheDocument();
    });

    await wait(() => {
      expect(queryByText(expectedTime)).toBeInTheDocument();
    });
  });

  test("should see basic notification summary with author email", async () => {
    // ARRANGE
    newNotif = {
      user: "veronicablackwell@tw.com",
      updatedAt: "2020-03-19T18:57:31.953Z",
      caseReference: "AC2020-0004",
      author: { name: "", email: "sydbotz@gmail.com" }
    };
    const { queryByText } = renderNotificationText(newNotif);

    const expectedTime = moment(newNotif.updatedAt).format("MMM D h:mm A");

    // ASSERT
    await wait(() => {
      expect(
        queryByText("sydbotz@gmail.com mentioned you in AC2020-0004")
      ).toBeInTheDocument();
    });

    await wait(() => {
      expect(queryByText(expectedTime)).toBeInTheDocument();
    });
  });
});
