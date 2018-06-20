import updateCaseStatusDialogReducer from "./updateCaseStatusDialogReducer";
import { CASE_STATUS } from "../../../sharedUtilities/constants";
import {closeCaseStatusUpdateDialog, openCaseStatusUpdateDialog} from "../../actionCreators/casesActionCreators";

describe("updateCaseStatusDialogReducer", () => {
  test("should set the default state", () => {
    const expectedState = {
      open: false,
      nextStatus: ""
    };

    const actualState = updateCaseStatusDialogReducer(undefined, {
      type: "MOCK_ACTION"
    });

    expect(actualState).toEqual(expectedState);
  });

  test("should set status when dispatching action to open dialog", () => {
    const oldState = {
      open: false,
      nextStatus: ""
    };

    const expectedState = {
      open: true,
      nextStatus: CASE_STATUS.ACTIVE
    };

    const actualState = updateCaseStatusDialogReducer(
      oldState,
      openCaseStatusUpdateDialog(CASE_STATUS.ACTIVE)
    );

    expect(actualState).toEqual(expectedState)
  });

  test("should set status when dispatching action to close dialog", () => {
    const oldState = {
      open: true,
      nextStatus: CASE_STATUS.ACTIVE
    };

    const expectedState = {
      open: false,
      nextStatus: CASE_STATUS.ACTIVE
    };

    const actualState = updateCaseStatusDialogReducer(
      oldState,
      closeCaseStatusUpdateDialog()
    );

    expect(actualState).toEqual(expectedState)
  })
});
