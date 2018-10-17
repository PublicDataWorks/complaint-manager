import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import createConfiguredStore from "../createConfiguredStore";
import ExportAuditLogConfirmationDialog from "./ExportConfirmationDialog";
import { openExportAuditLogConfirmationDialog } from "../actionCreators/navBarActionCreators";
import generateExportJob from "./thunks/generateExportJob";
import { closeExportConfirmationDialog } from "../actionCreators/navBarActionCreators";

jest.mock("./thunks/generateExportJob", () => path => ({
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
      [generateExportJob("/api/export/schedule/AUDIT_LOG_EXPORT")],
      [closeExportConfirmationDialog()]
    ]);
  });
});
