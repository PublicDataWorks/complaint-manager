import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import removeCivilian from "./removeCivilian";
import {
  closeRemoveCivilianDialog,
  removeCivilianFailure,
  removeCivilianSuccess
} from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("removeCivilian", () => {
  let dispatch = jest.fn();
  const caseId = 123;
  const civilianId = 345;
  beforeEach(() => {
    dispatch.mockClear();
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementationOnce(() => false);
    await removeCivilian()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should redirect to login if unauthorized", async () => {
    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .delete(`/api/cases/${caseId}/civilians/${civilianId}`)
      .reply(401);

    await removeCivilian(civilianId, caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should dispatch error action if we get an unrecognized response", async () => {
    nock("http://localhost", {})
      .delete(`/api/cases/${caseId}/civilians/${civilianId}`)
      .reply(500);

    await removeCivilian(civilianId, caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(removeCivilianFailure());
  });

  test("should dispatch success when civilian removed successfully", async () => {
    const response = {
      some: "response"
    };
    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .delete(`/api/cases/${caseId}/civilians/${civilianId}`)
      .reply(200, response);

    await removeCivilian(civilianId, caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(removeCivilianSuccess(response));
    expect(dispatch).toHaveBeenCalledWith(closeRemoveCivilianDialog());
  });
});
