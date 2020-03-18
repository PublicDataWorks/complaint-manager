import createConfiguredStore from "../../../../createConfiguredStore";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import React from "react";
import NotificationCard from "./NotificationCard";
import { wait } from "@testing-library/dom";
import "@testing-library/jest-dom";

describe("notification card", () => {
  const renderNotificationCard = () => {
    const store = createConfiguredStore();
    const wrapper = render(
      <Provider store={store}>
        <Router>
          <NotificationCard />
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

  test("should see basic notification summary", async () => {
    // ARRANGE
    const { queryByText } = renderNotificationCard();
    //ACT

    //ASSERT
    //   await wait(() => {
    //     expect(
    //       queryByText("Veronica Blackwell mentioned you CC2020-1019")
    //     ).toBeInTheDocument();
    //   });
    //
    //   await wait(() => {
    //     expect(queryByText("3/16/2020 3:30 PM")).toBeInTheDocument();
    //   });
  });
});
