import getAccessToken from "../../auth/getAccessToken";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import { push } from "react-router-redux";
import editCaseOfficer from "./editCaseOfficer";
import nock from "nock";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("editCaseOfficer thunk", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementationOnce(() => false);

    await editCaseOfficer()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should dispatch success, clear selected officer, & redirect to case details when response is 200", async () => {
    const caseId = 100;
    const caseOfficerId = 100;
    const officerId = 200;

    const values = { payload: "test edit" };
    const payload = { ...values, officerId };

    const responseBody = { response: "Successful" };

    nock("http://localhost")
      .put(
        `/api/cases/${caseId}/cases-officers/${caseOfficerId}`,
        JSON.stringify(payload)
      )
      .reply(200, responseBody);

    await editCaseOfficer(caseId, caseOfficerId, officerId, values)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(clearSelectedOfficer());
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Officer was successfully updated")
    );
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
