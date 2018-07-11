import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import moment from "moment";
import downloader from "../../../cases/thunks/downloader";
import createConfiguredStore from "../../../createConfiguredStore";
import ExportAuditLogConfirmationDialog from "./ExportAuditLogConfirmationDialog";

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
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <ExportAuditLogConfirmationDialog dialogOpen={true} />
      </Provider>
    );

    const submitButton = wrapper
      .find('[data-test="exportAuditLogButton"]')
      .last();
    submitButton.simulate("click");

    const date = moment().format("YYYY-MM-DD_HH.MM");
    const fileName = `Complaint_Manager_Audit_Log_${date}.csv`;
    expect(dispatchSpy).toHaveBeenCalledWith(
      downloader("/api/export-audit-log", fileName, true)
    );
  });
});
