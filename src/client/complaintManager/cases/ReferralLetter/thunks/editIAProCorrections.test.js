import getAccessToken from "../../../../common/auth/getAccessToken";
import nock from "nock";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import { push } from "connected-react-router";
import editIAProCorrections from "./editIAProCorrections";
import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";

jest.mock("../../../../common/auth/getAccessToken");

describe("editIAProCorrections", () => {
  let caseId, dispatch, requestBody;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
    requestBody = {
      referralLetterIaproCorrections: [
        {
          id: 99,
          details: "Please fix xxx in IAPro."
        }
      ]
    };
  });

  test("dispatches snackbar success on success, doesn't redirect to case details page", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(
        `/api/cases/${caseId}/referral-letter/iapro-corrections`,
        requestBody
      )
      .reply(200, {});

    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("IAPro corrections were successfully updated")
    );
    expect(dispatch).not.toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("routes to given redirect url on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(
        `/api/cases/${caseId}/referral-letter/iapro-corrections`,
        requestBody
      )
      .reply(200, {});

    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("redirectRoute"));
  });
});
