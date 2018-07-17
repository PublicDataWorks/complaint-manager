import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import downloader from "../../../cases/thunks/downloader";
import createConfiguredStore from "../../../createConfiguredStore";
import ExportAuditLogConfirmationDialog from "./ExportConfirmationDialog";
import {openExportAuditLogConfirmationDialog} from "../../../actionCreators/navBarActionCreators";

jest.mock(
  "../../../cases/thunks/downloader",
  () => (path, fileName, fileNeedsUtfEncoding) => ({
    type: "MOCK_THUNK",
    path,
    fileName,
    fileNeedsUtfEncoding
  })
);

describe("ExportAuditLogConfirmationDialog", () => {
  test("should include date,time in file name & set fileNeedsUtfEncoding flag to true", () => {
    const store = createConfiguredStore();
    store.dispatch(openExportAuditLogConfirmationDialog())
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

    const fileNameRegex = /^Complaint_Manager_Audit_Log_\d\d\d\d-\d\d-\d\d_\d\d\.\d\d\.\d\d\.C[D|S]T\.csv/;
    const fileNameMatcher = expect.stringMatching(fileNameRegex);

    expect(dispatchSpy).toHaveBeenCalledWith(
      downloader("/api/export-audit-log", fileNameMatcher, true)
    );
  });
});
