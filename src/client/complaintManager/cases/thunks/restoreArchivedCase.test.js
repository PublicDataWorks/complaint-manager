import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import nock from "nock";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { closeRestoreArchivedCaseDialog } from "../../actionCreators/casesActionCreators";
import restoreArchivedCase from "./restoreArchivedCase";
import { RESTORE_ARCHIVED_CASE_FORM } from "../../../../sharedUtilities/constants";
import { startSubmit, stopSubmit } from "redux-form";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("restoreArchivedCase", () => {
  const dispatch = jest.fn();
  const existingCase = { id: 2 };

  beforeEach(() => {
    configureInterceptors({ dispatch });
  });

  test("should close restore case dialog when case restored successfully", async () => {
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${existingCase.id}/restore`)
      .reply(200, {});

    await restoreArchivedCase(existingCase.id)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      startSubmit(RESTORE_ARCHIVED_CASE_FORM)
    );
    expect(dispatch).toHaveBeenCalledWith(closeRestoreArchivedCaseDialog());
    expect(dispatch).toHaveBeenCalledWith(
      stopSubmit(RESTORE_ARCHIVED_CASE_FORM)
    );
  });

  test("should dispatch snackbar success when case restored successfully", async () => {
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${existingCase.id}/restore`)
      .reply(200, {});

    await restoreArchivedCase(existingCase.id)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      startSubmit(RESTORE_ARCHIVED_CASE_FORM)
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully restored")
    );
    expect(dispatch).toHaveBeenCalledWith(
      stopSubmit(RESTORE_ARCHIVED_CASE_FORM)
    );
  });
});
