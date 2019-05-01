import createConfiguredStore from "../createConfiguredStore";
import { getFeaturesSuccess } from "../actionCreators/featureTogglesActionCreators";
import { mount } from "enzyme/build";
import { Provider } from "react-redux";
import React from "react";
import ExportCasesForm from "./ExportCasesForm";
import { openExportCasesConfirmationDialog } from "../actionCreators/exportActionCreators";
import { changeInput } from "../testHelpers";
import { validateDateRangeFields } from "./ExportDateRange/validateDateRangeFields";
import { CASE_EXPORT_TYPE } from "../../sharedUtilities/constants";

jest.mock("./ExportDateRange/validateDateRangeFields");

describe("export cases", () => {
  let store, dispatchSpy, exportCasesForm;
  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    exportCasesForm = mount(
      <Provider store={store}>
        <ExportCasesForm />
      </Provider>
    );
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  test("open confirmation dialog without date range when export all cases button clicked", () => {
    const exportAllCasesButton = exportCasesForm.find(
      'button[data-test="exportAllCases"]'
    );

    exportAllCasesButton.simulate("click");
    const dialog = exportCasesForm.find('[data-test="exportConfirmationText"]');
    expect(dialog).toBeDefined();
    expect(dispatchSpy).toHaveBeenCalledWith(
      openExportCasesConfirmationDialog()
    );
  });

  test("first contact date selected by default", () => {
    changeInput(
      exportCasesForm,
      '[data-test="exportCasesFromInput"]',
      "2017-12-21"
    );
    changeInput(
      exportCasesForm,
      '[data-test="exportCasesToInput"]',
      "2018-12-21"
    );

    const exportRangedCasesButton = exportCasesForm.find(
      'button[data-test="exportRangedCases"]'
    );
    exportRangedCasesButton.simulate("click");
    const dialog = exportCasesForm.find('[data-test="exportConfirmationText"]');

    expect(dialog).toBeDefined();
    expect(dispatchSpy).toHaveBeenCalledWith(
      openExportCasesConfirmationDialog({
        exportStartDate: "2017-12-21",
        exportEndDate: "2018-12-21",
        type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
      })
    );
  });

  test("open confirmation dialog with date range when ranged button is clicked", () => {
    const firstContactDate = CASE_EXPORT_TYPE.FIRST_CONTACT_DATE;
    changeInput(
      exportCasesForm,
      '[data-test="exportCasesFromInput"]',
      "2017-12-21"
    );
    changeInput(
      exportCasesForm,
      '[data-test="exportCasesToInput"]',
      "2018-12-21"
    );

    const dateRangeTypeRadioButton = exportCasesForm
      .find(`[data-test="dateRangeTypeRadioButton.${firstContactDate}"]`)
      .last();
    dateRangeTypeRadioButton.simulate("click");

    const exportRangedCasesButton = exportCasesForm.find(
      'button[data-test="exportRangedCases"]'
    );
    exportRangedCasesButton.simulate("click");
    const dialog = exportCasesForm.find('[data-test="exportConfirmationText"]');

    expect(dialog).toBeDefined();
    expect(dispatchSpy).toHaveBeenCalledWith(
      openExportCasesConfirmationDialog({
        exportStartDate: "2017-12-21",
        exportEndDate: "2018-12-21",
        type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
      })
    );
  });

  test("should call validate on values when range export is clicked", () => {
    const formLabel = "exportCases";

    const values = {
      [`${formLabel}From`]: "2012-01-01",
      [`${formLabel}To`]: "2013-01-01",
      [`${formLabel}Type`]: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
    };

    const dateRange = {
      exportStartDate: "2012-01-01",
      exportEndDate: "2013-01-01",
      type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
    };

    changeInput(
      exportCasesForm,
      '[data-test="exportCasesFromInput"]',
      dateRange.exportStartDate
    );
    changeInput(
      exportCasesForm,
      '[data-test="exportCasesToInput"]',
      dateRange.exportEndDate
    );
    const exportRangedCasesButton = exportCasesForm.find(
      'button[data-test="exportRangedCases"]'
    );
    exportRangedCasesButton.simulate("click");

    expect(validateDateRangeFields).toHaveBeenCalledWith(values, formLabel);
  });
});
