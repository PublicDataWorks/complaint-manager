import { mount } from "enzyme";
import { Provider } from "react-redux";
import React, { cloneElement } from "react";
import createConfiguredStore from "./createConfiguredStore";
import { MemoryRouter } from "react-router";
import AppRouter from "./AppRouter";

jest.mock(
  "./common/components/Visualization/Visualization",
  () => "Visualization"
);

describe("AppRouter", () => {
  let appWrapper, store;

  describe("Data Dashboard Route", () => {
    beforeEach(() => {
      store = createConfiguredStore();
      appWrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/dashboard"]}>
            <AppRouter />
          </MemoryRouter>
        </Provider>
      );
    });

    test("displays /dashboard complainant manager route", () => {
      appWrapper.update();
      const disProRoute = appWrapper.find("Route[path='/dashboard']");
      expect(disProRoute.exists()).toBeTrue();
    });
  });
});
