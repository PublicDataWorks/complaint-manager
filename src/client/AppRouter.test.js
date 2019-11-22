import { mount } from "enzyme";
import { Provider } from "react-redux";
import React, { cloneElement } from "react";
import createConfiguredStore from "./createConfiguredStore";
import { MemoryRouter } from "react-router";
import { getFeaturesSuccess } from "./complaintManager/actionCreators/featureTogglesActionCreators";
import StyleGuide from "./common/globalStyling/StyleGuide";
import AppRouter from "./AppRouter";
import { MatrixList } from "./matrixManager/matrices/MatrixList/MatrixList";

describe("AppRouter", () => {
  let appWrapper, store;

  beforeEach(() => {
    store = createConfiguredStore();
    appWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/matrices"]}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    );
  });

  test("displays matrix manager route when feature flag enabled", () => {
    store.dispatch(
      getFeaturesSuccess({
        matrixManagerFeature: true
      })
    );
    appWrapper.update();
    const disProRoute = appWrapper.find("Route[path='/matrices']");
    expect(disProRoute.exists()).toBeTrue();
  });

  test("displays matrix manager route when feature flag doesn't exist", () => {
    const disProRoute = appWrapper.find("Route[path='/matrices']");
    expect(disProRoute.exists()).toBeTrue();
    expect(appWrapper.find("AppRouter").props().featureToggles).toEqual({});
  });

  test("does not display matrix manager route when feature flag disabled", () => {
    store.dispatch(
      getFeaturesSuccess({
        matrixManagerFeature: false
      })
    );
    appWrapper.update();
    const disProRoute = appWrapper.find("Route[path='/matrices']");
    expect(disProRoute.exists()).toBeFalse();
  });
});
