import exportDialogReducer from "./exportDialogReducer";
import {
  closeExportConfirmationDialog,
  openExportAllCasesConfirmationDialog,
  openExportAuditLogConfirmationDialog
} from "../../actionCreators/exportActionCreators";

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
        exportEndDAte: "some date"
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
      openExportAllCasesConfirmationDialog()
    );

    const expectedState = {
      open: true,
      path: "/api/export/schedule/CASE_EXPORT",
      title: "All Case Information",
      warningText: "all cases in",
      dateRange: null
    };

    expect(newState).toEqual(expectedState);
  });
});
