import configureInterceptors from "../../axiosInterceptors/interceptors";
import nock from "nock";
import { getMinimumCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import getMinimumCaseDetails from "./getMinimumCaseDetails";

jest.mock("../../auth/getAccessToken", () => () => true);

describe("getMinimumCaseDetails", () => {
  let caseId, dispatch;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
  });

  test("dispatches case details on success", async () => {
    const minimumCaseDetailsResponse = [
      { caseReference: "CC2017-0005", status: "status" }
    ];

    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/minimum-case-details`)
      .reply(200, minimumCaseDetailsResponse);

    await getMinimumCaseDetails(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getMinimumCaseDetailsSuccess(minimumCaseDetailsResponse)
    );
  });
});
