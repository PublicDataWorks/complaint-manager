import { getCaseHistorySuccess } from "../../actionCreators/caseHistoryActionCreators";
import getAccessToken from "../../../common/auth/getAccessToken";
import nock from "nock";
import getCaseHistory from "./getCaseHistory";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";

jest.mock("../../../common/auth/getAccessToken");

describe("getCaseHistory", () => {
  const caseId = 2;
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const token = "token";

  test("should dispatch success when receive case history with 200", async () => {
    const responseBody = [{ action: AUDIT_ACTION.DATA_UPDATED, changes: {} }];
    getAccessToken.mockImplementation(() => token);

    nock("http://localhost/")
      .get(`/api/cases/${caseId}/case-history`)
      .reply(200, responseBody);

    await getCaseHistory(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(getCaseHistorySuccess(responseBody));
  });
});
