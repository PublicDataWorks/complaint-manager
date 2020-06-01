import getCaseNotes from "./getCaseNotes";
import nock from "nock";
import {
  fetchingCaseNotes,
  getCaseNotesSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

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
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch success when case notes fetched", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}/case-notes`)
      .reply(200, responseBody);

    await getCaseNotes(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(getCaseNotesSuccess(responseBody));
  });

  test("should dispatch fetchingCaseNotes as true while fetching and as false when finished", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}/case-notes`)
      .reply(200, responseBody);

    await getCaseNotes(caseId)(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, fetchingCaseNotes(true));
    expect(dispatch).toHaveBeenLastCalledWith(fetchingCaseNotes(false));
  });
});
