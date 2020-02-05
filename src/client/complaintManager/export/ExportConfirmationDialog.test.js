import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import createConfiguredStore from "../../createConfiguredStore";
import ExportAuditLogConfirmationDialog from "./ExportConfirmationDialog";
import generateExportJob from "./thunks/generateExportJob";
import {
  closeExportConfirmationDialog,
  exportJobStarted,
  openExportAuditLogConfirmationDialog
} from "../actionCreators/exportActionCreators";
import { containsText } from "../../testHelpers";
import formatDate from "../utilities/formatDate";
import { CASE_EXPORT_TYPE } from "../../../sharedUtilities/constants";

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
      .find('[data-testid="exportAuditLogButton"]')
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
      .find('[data-testid="exportAuditLogButton"]')
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

  describe("export confirmation dialog text", () => {
    test("export confirmation text for exporting all records contains no date range information", () => {
      const store = createConfiguredStore();
      store.dispatch(openExportAuditLogConfirmationDialog());

      const wrapper = mount(
        <Provider store={store}>
          <ExportAuditLogConfirmationDialog />
        </Provider>
      );

      containsText(
        wrapper,
        '[data-testid="exportConfirmationText"]',
        `This action will export a log of all actions taken in the system as a .csv file. This file will download automatically and may take a few seconds to generate.`
      );
    });

    test("export confirmation text for exporting a range of audits contains date range but no type", () => {
      const exportStartDate = "2017-12-21";
      const exportEndDate = "2018-12-21";

      const store = createConfiguredStore();
      store.dispatch(
        openExportAuditLogConfirmationDialog({
          exportStartDate,
          exportEndDate
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <ExportAuditLogConfirmationDialog />
        </Provider>
      );

      containsText(
        wrapper,
        '[data-testid="exportConfirmationText"]',
        `This action will export a log of all actions taken in the system between ${formatDate(
          exportStartDate
        )} and ${formatDate(
          exportEndDate
        )} as a .csv file. This file will download automatically and may take a few seconds to generate.`
      );
    });

    test("export confirmation text for exporting a range of cases contains date range with type", () => {
      const exportStartDate = "2017-12-21";
      const exportEndDate = "2018-12-21";
      const type = CASE_EXPORT_TYPE.FIRST_CONTACT_DATE;

      const store = createConfiguredStore();
      store.dispatch(
        openExportAuditLogConfirmationDialog({
          exportStartDate,
          exportEndDate,
          type
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <ExportAuditLogConfirmationDialog />
        </Provider>
      );

      containsText(
        wrapper,
        '[data-testid="exportConfirmationText"]',
        `This action will export a log of all actions taken in the system with a first contact date between ${formatDate(
          exportStartDate
        )} and ${formatDate(
          exportEndDate
        )} as a .csv file. This file will download automatically and may take a few seconds to generate.`
      );
    });
  });
});
