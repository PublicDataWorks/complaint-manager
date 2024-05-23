import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import UserAvatar from "./UserAvatar";
import { Provider } from "react-redux";
import createConfiguredStore from "../../createConfiguredStore";
import { getUsersSuccess } from "../../common/actionCreators/usersActionCreators";

describe("UserAvatar", () => {
  let store;
  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(
      getUsersSuccess([{ email: "test@gmail.com", name: "Tom Edwards" }])
    );
  });

  test("should parse first letter from user first name and last name", async () => {
    render(
      <Provider store={store}>
        <UserAvatar email="test@gmail.com" />
      </Provider>
    );

    await waitFor(() => {
      const avatarElement = screen.getByTestId("tooltip-TE");
      expect(avatarElement).toBeTruthy();
      expect(avatarElement.title).toEqual("test@gmail.com");
      expect(avatarElement.textContent).toEqual("TE");
    });
  });

  it("should display full email on mouse hover", () => {
    render(
      <Provider store={store}>
        <UserAvatar email="test@gmail.com"></UserAvatar>
      </Provider>
    );
    fireEvent.mouseMove(screen.getByTitle("test@gmail.com"));
    expect(screen.getByTestId("tooltip-TE")).toBeTruthy();
  });

  it("should not display avatar unless an email is provided", () => {
    render(
      <Provider store={store}>
        <UserAvatar></UserAvatar>
      </Provider>
    );
    expect(screen.getByTestId("no-avatar")).toBeTruthy();
  });
});
