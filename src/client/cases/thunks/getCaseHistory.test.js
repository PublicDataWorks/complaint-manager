import { getCaseHistorySuccess } from "../../actionCreators/caseHistoryActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import getCaseHistory from "./getCaseHistory";
import { push } from "react-router-redux";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";
import { getCaseNumberSuccess } from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getCaseHistory", () => {
  const caseId = 2;
  const dispatch = jest.fn();
  const token = "token";

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => null);
    await getCaseHistory(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("should dispatch success when receive case history with 200", async () => {
    const responseBody = [{ action: AUDIT_ACTION.DATA_UPDATED, changes: {} }];
    getAccessToken.mockImplementation(() => token);

    nock("http://localhost/")
      .get(`/api/cases/${caseId}/case-history`)
      .reply(200, responseBody);

    const caseNumberResponse = [{ caseNumber: "CC2017-0234" }];

    nock("http://localhost/")
      .get(`/api/cases/${caseId}/case-number`)
      .reply(200, caseNumberResponse);

    await getCaseHistory(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getCaseNumberSuccess(caseNumberResponse)
    );
    expect(dispatch).toHaveBeenCalledWith(getCaseHistorySuccess(responseBody));
  });

  test("dispatches snackbar error when 500 response code", async () => {
    getAccessToken.mockImplementation(() => token);
    nock("http://localhost/", {
      reqheaders: {
        Authorization: `Bearer ${token}`
      }
    })
      .get(`/api/cases/${caseId}/case-history`)
      .reply(500);

    await getCaseHistory(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the case history was not loaded. Please try again."
      )
    );
  });
});
