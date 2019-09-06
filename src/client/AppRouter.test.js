import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import createConfiguredStore from "./createConfiguredStore";
import { MemoryRouter } from "react-router";
import { getFeaturesSuccess } from "./actionCreators/featureTogglesActionCreators";
describe("AppRouter", () => {
  let appWrapper, store;

  beforeEach(() => {
    store = createConfiguredStore();
    appWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/disciplinary-proceedings"]}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    );
  });

  test("displays disciplinary proceedings route when feature flag enabled", () => {
    store.dispatch(
      getFeaturesSuccess({
        disciplinaryProceedingsFeature: true
      })
    );
    appWrapper.update();
    const routeComponent = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    expect(routeComponent.exists()).toBeTrue();
  });

  test("displays disciplinary proceedings route when feature flag doesn't exist", () => {
    const routeComponent = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    expect(routeComponent.exists()).toBeTrue();
    expect(appWrapper.find("AppRouter").props().featureToggles).toEqual({});
  });

  test("does not display disciplinary proceedings route when feature flag disabled", () => {
    store.dispatch(
      getFeaturesSuccess({
        disciplinaryProceedingsFeature: false
      })
    );
    appWrapper.update();
    const routeComponent = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    expect(routeComponent.exists()).toBeFalse();
  });
});

import AppRouter from "./AppRouter";
