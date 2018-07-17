import exportDialogReducer from "./exportDialogReducer";
import {
  closeExportConfirmationDialog,
  openExportAllCasesConfirmationDialog,
  openExportAuditLogConfirmationDialog
} from "../../actionCreators/navBarActionCreators";

describe("export dialog reducer", () => {
  test("should set default state", () => {
    const newState = exportDialogReducer(undefined, { type: "SOME ACTION" });
    const expectedState = { open: false, path: "", title: "", warningText: "" };
    expect(newState).toEqual(expectedState);
  });

  test("should set state for open export audit log confirmation", () => {
    const initialState = { open: false, path: "", title: "", warningText: "" };
    const newState = exportDialogReducer(
      initialState,
      openExportAuditLogConfirmationDialog()
    );

    const expectedState = {
      open: true,
      path: "/api/export-audit-log",
      title: "Audit Log",
      warningText: "a log of all actions taken within"
    };

    expect(newState).toEqual(expectedState);
  });

  test("should close dialog and leave other state as is", () => {
    const initialState = {
      open: true,
      path: "/api/export-audit-log",
      title: "Audit Log",
      warningText: "a log of all actions taken within"
    };

    const newState = exportDialogReducer(
      initialState,
      closeExportConfirmationDialog()
    );
    const expectedState = { ...initialState, open: false };

    expect(newState).toEqual(expectedState);
  });

  test("should set state for open export all cases confirmation", () => {
    const initialState = { open: false, path: "", title: "", warningText: "" };
    const newState = exportDialogReducer(
      initialState,
      openExportAllCasesConfirmationDialog()
    );

    const expectedState = {
      open: true,
      path: "/api/cases/export",
      title: "All Case Information",
      warningText: "all cases in"
    };

    expect(newState).toEqual(expectedState);
  });
});
