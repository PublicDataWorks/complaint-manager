import {
  exportJobStarted,
  clearCurrentExportJob
} from "../../actionCreators/exportActionCreators";
import allExportsReducer from "./allExportsReducer";

describe("allExportsReducer", () => {
  test("default is disabled false", () => {
    const newState = allExportsReducer(undefined, { type: "SOMETHING" });
    expect(newState).toEqual({ buttonsDisabled: false, showProgress: false });
  });

  test("EXPORT_JOB_STARTED sets disabled to true", () => {
    const newState = allExportsReducer({}, exportJobStarted());
    expect(newState).toEqual({ buttonsDisabled: true, showProgress: true });
  });

  test("CLEAR_CURRENT_EXPORT_JOB sets disabled to false", () => {
    const newState = allExportsReducer({}, clearCurrentExportJob());
    expect(newState).toEqual({ buttonsDisabled: false, showProgress: false });
  });
});
