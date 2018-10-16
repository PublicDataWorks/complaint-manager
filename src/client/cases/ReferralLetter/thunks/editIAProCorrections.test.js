import getAccessToken from "../../../auth/getAccessToken";
import nock from "nock";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import { push } from "react-router-redux";
import editIAProCorrections from "./editIAProCorrections";
import { editIAProCorrectionsSuccess } from "../../../actionCreators/letterActionCreators";
jest.mock("../../../auth/getAccessToken");

describe("editIAProCorrections", () => {
  let caseId, dispatch, requestBody;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
    requestBody = {
      referralLetterIAProCorrections: [
        {
          id: 99,
          details: "Please fix xxx in IAPro."
        }
      ]
    };
  });

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => false);
    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("dispatches success with iapro corrections on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    const responseBody = {
      id: 9,
      referralLetterIAProCorrections: [
        {
          id: 99,
          details: "This was saved."
        }
      ]
    };
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
      .reply(200, responseBody);

    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      editIAProCorrectionsSuccess(responseBody)
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("IAPro corrections were successfully updated")
    );
  });

  test("routes to given redirect url on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    const responseBody = { id: 9, referralLetterIAProCorrections: [] };
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
      .reply(200, responseBody);

    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("redirectRoute"));
  });

  test("dispatches failure on error response", async () => {
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
      .reply(500);

    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the IAPro corrections were not updated. Please try again."
      )
    );
  });
});
