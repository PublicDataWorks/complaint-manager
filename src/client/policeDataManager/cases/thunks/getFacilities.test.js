import nock from "nock";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import {
  fetchingCaseTags,
  getCaseTagSuccess
} from "../../actionCreators/casesActionCreators";
import getCaseTags from "./getCaseTags";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("getCaseTags", () => {
  const dispatch = jest.fn();
  const caseId = 1;
  const tagId = 2;
  const responseBody = [
    {
      id: 1,
      caseId: caseId,
      tagId: tagId
    }
  ];

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch success when case tags fetched", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}/case-tags`)
      .reply(200, responseBody);

    await getCaseTags(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(getCaseTagSuccess(responseBody));
  });

  test("should dispatch fetchingCaseTags as true while fetching and as false when finished", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}/case-tags`)
      .reply(200, responseBody);

    await getCaseTags(caseId)(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, fetchingCaseTags(true));
    expect(dispatch).toHaveBeenLastCalledWith(fetchingCaseTags(false));
  });
});
