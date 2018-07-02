import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import editCaseOfficer from "./editCaseOfficer";
import nock from "nock";
import {
  clearSelectedOfficer,
  editCaseOfficerFailure,
  editCaseOfficerSuccess
} from "../../actionCreators/officersActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("editCaseOfficer thunk", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
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

    expect(dispatch).toHaveBeenCalledWith(editCaseOfficerSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(clearSelectedOfficer());
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("should dispatch failure when 500 response", async () => {
    const caseId = 100;
    const caseOfficerId = 100;
    const officerId = 200;

    const values = { payload: "test edit" };
    const payload = { ...values, officerId };

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(
        `/api/cases/${caseId}/cases-officers/${caseOfficerId}`,
        JSON.stringify(payload)
      )
      .reply(500, {});

    await editCaseOfficer(caseId, caseOfficerId, officerId, values)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(editCaseOfficerFailure());
  });
});
