import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import createConfiguredStore from "../createConfiguredStore";
import ExportAuditLogConfirmationDialog from "./ExportConfirmationDialog";
import generateExportJob from "./thunks/generateExportJob";
import {
  closeExportConfirmationDialog,
  exportJobStarted,
  openExportAuditLogConfirmationDialog
} from "../actionCreators/exportActionCreators";

jest.mock("./thunks/generateExportJob", () => (path, dateRange = null) => ({
  type: "MOCK_THUNK",
  path,
  dateRange
}));

describe("ExportAuditLogConfirmationDialog", () => {
  test("should trigger generateExportJob, exportJobStarted, and closeDialog when click export button", () => {
    const store = createConfiguredStore();
    store.dispatch(openExportAuditLogConfirmationDialog());
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <ExportAuditLogConfirmationDialog />
      </Provider>
    );

    const exportButton = wrapper
      .find('[data-test="exportAuditLogButton"]')
      .last();
    exportButton.simulate("click");

    expect(dispatchSpy.mock.calls).toEqual([
      [generateExportJob("/api/export/schedule/AUDIT_LOG_EXPORT")],
      [exportJobStarted()],
      [closeExportConfirmationDialog()]
    ]);
  });

  test("should call generateExportJob with date range when date range in state", () => {
    const exportStartDate = "2017-12-21";
    const exportEndDate = "2018-12-21";

    const store = createConfiguredStore();
    store.dispatch(
      openExportAuditLogConfirmationDialog({
        exportStartDate,
        exportEndDate
      })
    );
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <ExportAuditLogConfirmationDialog />
      </Provider>
    );

    const exportButton = wrapper
      .find('[data-test="exportAuditLogButton"]')
      .last();
    exportButton.simulate("click");

    expect(dispatchSpy.mock.calls).toEqual([
      [
        generateExportJob("/api/export/schedule/AUDIT_LOG_EXPORT", {
          exportStartDate,
          exportEndDate
        })
      ],
      [exportJobStarted()],
      [closeExportConfirmationDialog()]
    ]);
  });
});
