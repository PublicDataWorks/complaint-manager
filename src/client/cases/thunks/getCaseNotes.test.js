import getCaseNotes from "./getCaseNotes";
import nock from "nock";
import getAccessToken from "../../auth/getAccessToken";
import { getCaseNotesSuccess } from "../../actionCreators/casesActionCreators";
import { push } from "react-router-redux";
import configureInterceptors from "../../interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getCaseNotes", () => {
  const dispatch = jest.fn();
  const caseId = 1;
  const responseBody = [
    {
      id: 1,
      caseId: caseId,
      user: "tuser",
      action: "Created case"
    }
  ];
  beforeEach(() => {
    configureInterceptors({dispatch});
    dispatch.mockClear();
  });

  test("should dispatch success when case notes fetched", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}/case-notes`)
      .reply(200, responseBody);

    await getCaseNotes(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getCaseNotesSuccess(responseBody)
    );
  });
});
