import exportDialogReducer from "./exportDialogReducer";
import {
  closeExportConfirmationDialog,
  openExportCasesConfirmationDialog,
  openExportAuditLogConfirmationDialog
} from "../../actionCreators/exportActionCreators";
import { CASE_EXPORT_TYPE } from "../../../sharedUtilities/constants";

describe("export dialog reducer", () => {
  test("should set default state", () => {
    const newState = exportDialogReducer(undefined, { type: "SOME ACTION" });
    const expectedState = {
      open: false,
      path: "",
      title: "",
      warningText: "",
      dateRange: null
    };
    expect(newState).toEqual(expectedState);
  });

  test("should set state for open export audit log confirmation", () => {
    const initialState = {
      open: false,
      path: "",
      title: "",
      warningText: "",
      dateRange: null
    };
    const newState = exportDialogReducer(
      initialState,
      openExportAuditLogConfirmationDialog()
    );

    const expectedState = {
      open: true,
      path: "/api/export/schedule/AUDIT_LOG_EXPORT",
      title: "Audit Log",
      warningText: "a log of all actions taken in",
      dateRange: null
    };

    expect(newState).toEqual(expectedState);
  });

  test("should set state with date range for open export audit log", () => {
    const initialState = {
      open: false,
      path: "",
      title: "",
      warningText: "",
      dateRange: null
    };
    const newState = exportDialogReducer(
      initialState,
      openExportAuditLogConfirmationDialog({
        exportStartDate: "2011-12-04",
        exportEndDate: "2011-12-06"
      })
    );

    const expectedState = {
      open: true,
      path: "/api/export/schedule/AUDIT_LOG_EXPORT",
      title: "Audit Log",
      warningText: "a log of all actions taken in",
      dateRange: {
        exportStartDate: "2011-12-04",
        exportEndDate: "2011-12-06"
      }
    };

    expect(newState).toEqual(expectedState);
  });

  test("should close dialog and leave other state as is", () => {
    const initialState = {
      open: true,
      path: "/api/export/schedule/AUDIT_LOG_EXPORT",
      title: "Audit Log",
      warningText: "a log of all actions taken in",
      dateRange: {
        exportStartDate: "some date",
        exportEndDate: "some date"
      }
    };

    const newState = exportDialogReducer(
      initialState,
      closeExportConfirmationDialog()
    );
    const expectedState = { ...initialState, open: false, dateRange: null };

    expect(newState).toEqual(expectedState);
  });

  test("should set state for open export all cases confirmation", () => {
    const initialState = {
      open: false,
      path: "",
      title: "",
      warningText: "",
      dateRange: null
    };
    const newState = exportDialogReducer(
      initialState,
      openExportCasesConfirmationDialog()
    );

    const expectedState = {
      open: true,
      path: "/api/export/schedule/CASE_EXPORT",
      title: "Cases",
      warningText: "all cases in",
      dateRange: null
    };

    expect(newState).toEqual(expectedState);
  });

  test("should set state with date range and type for open export all cases confirmation", () => {
    const initialState = {
      open: false,
      path: "",
      title: "",
      warningText: "",
      dateRange: null
    };
    const newState = exportDialogReducer(
      initialState,
      openExportCasesConfirmationDialog({
        exportStartDate: "2012-02-22",
        exportEndDate: "2015-02-03",
        type: CASE_EXPORT_TYPE.INCIDENT_DATE
      })
    );

    const expectedState = {
      open: true,
      path: "/api/export/schedule/CASE_EXPORT",
      title: "Cases",
      warningText: "all cases in",
      dateRange: {
        exportStartDate: "2012-02-22",
        exportEndDate: "2015-02-03",
        type: CASE_EXPORT_TYPE.INCIDENT_DATE
      }
    };

    expect(newState).toEqual(expectedState);
  });
});
