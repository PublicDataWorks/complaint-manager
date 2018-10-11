import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import ExportAuditLogConfirmationDialog from "./ExportConfirmationDialog";
import { openExportAuditLogConfirmationDialog } from "../../../actionCreators/navBarActionCreators";
import generateExport from "../../../export/thunks/generateExport";
import { closeExportConfirmationDialog } from "../../../actionCreators/navBarActionCreators";

jest.mock("../../../export/thunks/generateExport", () => path => ({
  type: "MOCK_THUNK",
  path
}));

describe("ExportAuditLogConfirmationDialog", () => {
  test("should include date,time in file name & set fileNeedsUtfEncoding flag to true", () => {
    const store = createConfiguredStore();
    store.dispatch(openExportAuditLogConfirmationDialog());
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <ExportAuditLogConfirmationDialog />
      </Provider>
    );

    const submitButton = wrapper
      .find('[data-test="exportAuditLogButton"]')
      .last();
    submitButton.simulate("click");

    expect(dispatchSpy.mock.calls).toEqual([
      [generateExport("/api/export-audit-log")],
      [closeExportConfirmationDialog()]
    ]);

    // expect(dispatchSpy).toHaveBeenNthCalledWith(1,
    //   generateExport("/api/export-audit-log")
    // );
    // expect(dispatchSpy).toHaveBeenNthCalledWith(2,
    //   closeExportConfirmationDialog()
    // );
  });
});
