import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../createConfiguredStore";
import { mount } from "enzyme";
import AllExports from "./AllExports";
import { openExportAllCasesConfirmationDialog } from "../actionCreators/navBarActionCreators";
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

  test("open confirmation dialog when button clicked", () => {
    const exportCasesButton = allExports.find(
      'button[data-test="openExportConfirmationDialog"]'
    );
    exportCasesButton.simulate("click");
    const dialog = allExports.find(
      '[data-test="exportAuditLogConfirmationText"]'
    );
    expect(dialog).toBeDefined();
    expect(dispatchSpy).toHaveBeenCalledWith(
      openExportAllCasesConfirmationDialog()
    );
  });

  test("display job detail when job id is set", () => {
    store.dispatch(generateExportSuccess(19));

    const jobDetail = allExports.find('[data-test="waitingForJob"]');
    expect(jobDetail).toBeDefined();
  });
});
