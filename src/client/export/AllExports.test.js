import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../createConfiguredStore";
import { mount } from "enzyme";
import AllExports from "./AllExports";
import { generateExportSuccess } from "../actionCreators/exportActionCreators";

describe("Export all cases", () => {
  let allExports, dispatchSpy, store;

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    allExports = mount(
      <Provider store={store}>
        <AllExports />
      </Provider>
    );
  });

  test("display job detail when job id is set", () => {
    store.dispatch(generateExportSuccess(19));

    const jobDetail = allExports.find('[data-test="waitingForJob"]');
    expect(jobDetail).toBeDefined();
  });
});
