import getAccessToken from "../../../common/auth/getAccessToken";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { push } from "connected-react-router";
import editCaseOfficer from "./editCaseOfficer";
import nock from "nock";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { EMPLOYEE_TYPE } from "../../../../sharedUtilities/constants";
import { CIVILIAN_WITHIN_PD_TITLE } from "../../../../instance-files/constants";
import { authEnabledTest } from "../../../testHelpers";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("editCaseOfficer thunk", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
  });

  describe("auth test(s)", () => {
    const test = authEnabledTest();
    test("should redirect immediately if token missing", async () => {
      getAccessToken.mockImplementationOnce(() => false);

      await editCaseOfficer()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(push(`/login`));
    });
  });

  test("should dispatch success, clear selected officer, & redirect to case details when response is 200", async () => {
    const caseId = 100;
    const caseOfficerId = 100;
    const officerId = 200;
    const caseEmployeeType = EMPLOYEE_TYPE.OFFICER;

    const values = {
      payload: "test edit",
      phoneNumber: "8005882300",
      email: "AVeryGoodBoi@gmail.com"
    };
    const payload = { ...values, officerId };

    const responseBody = { response: "Successful" };

    nock("http://localhost")
      .put(
        `/api/cases/${caseId}/cases-officers/${caseOfficerId}`,
        JSON.stringify(payload)
      )
      .reply(200, responseBody);

    await editCaseOfficer(
      caseId,
      caseOfficerId,
      officerId,
      caseEmployeeType,
      values
    )(dispatch);

    expect(dispatch).toHaveBeenCalledWith(clearSelectedOfficer());
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Officer was successfully updated")
    );
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("should dispatch success, clear selected employee, & redirect to case details when response is 200", async () => {
    const caseId = 100;
    const caseOfficerId = 100;
    const officerId = 200;
    const caseEmployeeType = EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD;

    const values = { payload: "test edit" };
    const payload = { ...values, officerId };

    const responseBody = { response: "Successful" };

    nock("http://localhost")
      .put(
        `/api/cases/${caseId}/cases-officers/${caseOfficerId}`,
        JSON.stringify(payload)
      )
      .reply(200, responseBody);

    await editCaseOfficer(
      caseId,
      caseOfficerId,
      officerId,
      caseEmployeeType,
      values
    )(dispatch);

    expect(dispatch).toHaveBeenCalledWith(clearSelectedOfficer());
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess(`${CIVILIAN_WITHIN_PD_TITLE} was successfully updated`)
    );
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
