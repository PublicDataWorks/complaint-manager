import { push } from "connected-react-router";
import setCaseStatus from "./setCaseStatus";
import nock from "nock";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import {
  closeCaseStatusUpdateDialog,
  updateCaseStatusSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("setCaseStatus", () => {
  const dispatch = jest.fn();
  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should reply a 200, dispatch a snackbar success message, and close the dialog on success", async () => {
    const updateDetails = {
      id: 1,
      status: CASE_STATUS.ACTIVE
    };
    const responseBody = { id: 1 };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .put(`/api/cases/${updateDetails.id}/status`, {
        status: updateDetails.status
      })
      .reply(200, responseBody);

    await setCaseStatus(updateDetails.id, updateDetails.status)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      updateCaseStatusSuccess(responseBody)
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Status was successfully updated")
    );
    expect(dispatch).toHaveBeenCalledWith(closeCaseStatusUpdateDialog());
  });

  test("should redirect to redirect url on success if given", async () => {
    const updateDetails = {
      id: 1,
      status: CASE_STATUS.ACTIVE
    };
    const responseBody = { id: 1 };
    const redirectUrl = "url";

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .put(`/api/cases/${updateDetails.id}/status`, {
        status: updateDetails.status
      })
      .reply(200, responseBody);

    await setCaseStatus(
      updateDetails.id,
      updateDetails.status,
      redirectUrl
    )(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push(redirectUrl));
  });
});
