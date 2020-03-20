import createConfiguredStore from "../../../../createConfiguredStore";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import React from "react";
import NotificationList from "./NotificationList";
import { wait } from "@testing-library/dom";
import "@testing-library/jest-dom";

describe("notification list", () => {
  let allNotifs, allUsers;
  const renderNotificationList = (allNotifs, allUsers) => {
    const store = createConfiguredStore();
    const wrapper = render(
      <Provider store={store}>
        <Router>
          <NotificationList notifications={allNotifs} allUsers={allUsers} />
        </Router>
      </Provider>
    );

    store.dispatch(
      getFeaturesSuccess({
        notificationFeature: true
      })
    );
    return wrapper;
  };

  test("should render 2 notification cards if the user has 2 notifications", async () => {
    allUsers = [
      { email: "veronicablackwel@tw.com", name: "Veronica B" },
      { email: "sydbotz@tw.com", name: "Syd B" },
      { email: "wanchenyao@tw.com", name: "Wanchen Y" }
    ];

    allNotifs = [
      {
        user: "veronicablackwell@tw.com",
        updatedAt: "2020-03-19T18:57:31.953Z",
        caseReference: "AC2020-0004",
        mentioner: "sydbotz@tw.com",
        id: 1
      },
      {
        user: "veronicablackwell@tw.com",
        updatedAt: "2019-11-29T19:31:41.953Z",
        caseReference: "CC2019-0018",
        mentioner: "wanchenyao@tw.com",
        id: 2
      }
    ];
    const { queryByText } = renderNotificationList(allNotifs, allUsers);

    await wait(() => {
      expect(
        queryByText("Syd B mentioned you in AC2020-0004")
      ).toBeInTheDocument();
    });

    await wait(() => {
      expect(
        queryByText("Wanchen Y mentioned you in CC2019-0018")
      ).toBeInTheDocument();
    });
  });
});
