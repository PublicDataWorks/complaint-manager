import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../createConfiguredStore";
import { mount } from "enzyme";
import ExportAllCases from "./ExportAllCases";
import { openExportAllCasesConfirmationDialog } from "../actionCreators/navBarActionCreators";
import { generateExportSuccess } from "../actionCreators/exportActionCreators";

describe("Export all cases", () => {
  let exportAllCases, dispatchSpy, store;

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    exportAllCases = mount(
      <Provider store={store}>
        <ExportAllCases />
      </Provider>
    );
  });

  test("open confirmation dialog when button clicked", () => {
    const exportCasesButton = exportAllCases.find(
      'button[data-test="openExportConfirmationDialog"]'
    );
    exportCasesButton.simulate("click");
    const dialog = exportAllCases.find(
      '[data-test="exportAuditLogConfirmationText"]'
    );
    expect(dialog).toBeDefined();
    expect(dispatchSpy).toHaveBeenCalledWith(
      openExportAllCasesConfirmationDialog()
    );
  });

  test("display job detail when job id is set", () => {
    store.dispatch(generateExportSuccess(19));

    const jobDetail = exportAllCases.find('[data-test="waitingForJob"]');
    expect(jobDetail).toBeDefined();
  });
});
