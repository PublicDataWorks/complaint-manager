import nock from "nock";
import getAccessToken from "../../auth/getAccessToken";
import getCaseDetail from "./getCaseDetails";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

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

  test("should show snackbar error on error", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}`)
      .reply(500);

    await getCaseDetail(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the case details were not loaded. Please try again."
      )
    );
  });
});
