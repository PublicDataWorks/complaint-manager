import nock from "nock";
import getAccessToken from "../../auth/getAccessToken";
import getCaseDetail from "./getCaseDetails";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getCase", () => {
  const dispatch = jest.fn();
  const responseBody = { caseDetailProp: "case detail value" };
  const caseId = 100;

  beforeEach(() => {
    configureInterceptors({ dispatch });
    getAccessToken.mockClear();
    dispatch.mockClear();
  });

  test("should dispatch success when case retrieved", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}`)
      .reply(200, responseBody);

    await getCaseDetail(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(getCaseDetailsSuccess(responseBody));
  });
});
