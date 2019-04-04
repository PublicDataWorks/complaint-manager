import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../createConfiguredStore";
import { mount } from "enzyme";
import { openExportAuditLogConfirmationDialog } from "../actionCreators/exportActionCreators";
import ExportAuditLogForm from "./ExportAuditLogForm";
import { changeInput } from "../testHelpers";
import { getFeaturesSuccess } from "../actionCreators/featureTogglesActionCreators";
import { userAuthSuccess } from "../auth/actionCreators";
import { USER_PERMISSIONS } from "../../sharedUtilities/constants";

describe("Export audits", () => {
  let exportAuditLogForm, dispatchSpy, store;

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(
      userAuthSuccess({
        nickname: "user",
        permissions: [USER_PERMISSIONS.EXPORT_AUDIT_LOG]
      })
    );
    store.dispatch(
      getFeaturesSuccess({
        dateRangeExportFeature: true
      })
    );

    exportAuditLogForm = mount(
      <Provider store={store}>
        <ExportAuditLogForm />
      </Provider>
    );
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  describe("dateRangeAuditLog feature off", () => {
    beforeEach(() => {
      store.dispatch(getFeaturesSuccess({ dataRangeExportFeature: false }));

      exportAuditLogForm.update();
    });

    test("exports all audits with dataRangeExportFeature toggled off", () => {
      const exportAllAuditsButton = exportAuditLogForm.find(
        'button[data-test="exportAllAudits"]'
      );

      exportAllAuditsButton.simulate("click");
      const dialog = exportAuditLogForm.find(
        '[data-test="exportConfirmationText"]'
      );
      expect(dialog).toBeDefined();
      expect(dispatchSpy).toHaveBeenCalledWith(
        openExportAuditLogConfirmationDialog()
      );
    });

    test("cannot export ranged audits with dataRangeExportFeature toggled off", () => {
      expect(
        exportAuditLogForm
          .find('button[data-test="exportRangedAudits"]')
          .exists()
      ).toBeFalsy();
      expect(
        exportAuditLogForm
          .find('[data-test="exportAuditLogFromInput"]')
          .exists()
      ).toBeFalsy();
      expect(
        exportAuditLogForm.find('[data-test="exportAuditLogToInput"]').exists()
      ).toBeFalsy();
    });
  });

  test("open confirmation dialog without date range when all button clicked", () => {
    const exportAllAuditsButton = exportAuditLogForm.find(
      'button[data-test="exportAllAudits"]'
    );

    exportAllAuditsButton.simulate("click");
    const dialog = exportAuditLogForm.find(
      '[data-test="exportConfirmationText"]'
    );
    expect(dialog).toBeDefined();
    expect(dispatchSpy).toHaveBeenCalledWith(
      openExportAuditLogConfirmationDialog()
    );
  });

  test("open confirmation dialog with date range when ranged button clicked", () => {
    changeInput(
      exportAuditLogForm,
      '[data-test="exportAuditLogFromInput"]',
      "2017-12-21"
    );
    changeInput(
      exportAuditLogForm,
      '[data-test="exportAuditLogToInput"]',
      "2018-12-21"
    );

    const exportRangedAuditsButton = exportAuditLogForm.find(
      'button[data-test="exportRangedAudits"]'
    );
    exportRangedAuditsButton.simulate("click");
    const dialog = exportAuditLogForm.find(
      '[data-test="exportConfirmationText"]'
    );

    expect(dialog).toBeDefined();
    expect(dispatchSpy).toHaveBeenCalledWith(
      openExportAuditLogConfirmationDialog({
        exportStartDate: "2017-12-21",
        exportEndDate: "2018-12-21"
      })
    );
  });

  test("should display error for ranged export when dates are empty", () => {
    const dateRange = {
      exportStartDate: "",
      exportEndDate: ""
    };
    changeInput(
      exportAuditLogForm,
      '[data-test="exportAuditLogFromInput"]',
      dateRange.exportStartDate
    );
    changeInput(
      exportAuditLogForm,
      '[data-test="exportAuditLogToInput"]',
      dateRange.exportEndDate
    );
    const exportRangedAuditsButton = exportAuditLogForm.find(
      'button[data-test="exportRangedAudits"]'
    );
    exportRangedAuditsButton.simulate("click");
    const exportAuditLogFromField = exportAuditLogForm.find(
      'div[data-test="exportAuditLogFromField"]'
    );
    expect(exportAuditLogFromField.text()).toContain("Please enter a date");
    const exportAuditLogToField = exportAuditLogForm.find(
      'div[data-test="exportAuditLogToField"]'
    );
    expect(exportAuditLogToField.text()).toContain("Please enter a date");
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      openExportAuditLogConfirmationDialog(dateRange)
    );
  });

  test("should display error for ranged export when from date is after to date", () => {
    const dateRange = {
      exportStartDate: "2018-12-21",
      exportEndDate: "2017-12-21"
    };
    changeInput(
      exportAuditLogForm,
      '[data-test="exportAuditLogFromInput"]',
      dateRange.exportStartDate
    );
    changeInput(
      exportAuditLogForm,
      '[data-test="exportAuditLogToInput"]',
      dateRange.exportEndDate
    );
    const exportRangedAuditsButton = exportAuditLogForm.find(
      'button[data-test="exportRangedAudits"]'
    );
    exportRangedAuditsButton.simulate("click");
    const exportAuditLogFromField = exportAuditLogForm.find(
      'div[data-test="exportAuditLogFromField"]'
    );
    expect(exportAuditLogFromField.text()).toContain(
      "From date cannot be after To date"
    );
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      openExportAuditLogConfirmationDialog(dateRange)
    );
  });
});
