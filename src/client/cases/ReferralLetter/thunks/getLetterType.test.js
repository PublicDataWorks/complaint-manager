import configureInterceptors from "../../../axiosInterceptors/interceptors";
import nock from "nock";
import { getLetterTypeSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import getLetterType from "./getLetterType";

jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getLetterType", () => {
  let dispatch = jest.fn();
  let caseId;
  const letterTypeResponseBody = {
    letterType: "letter type value"
  };

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch = jest.fn();
    caseId = 5;
  });

  test("dispatches success with response", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}/referral-letter/letter-type`)
      .reply(200, letterTypeResponseBody);

    await getLetterType(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getLetterTypeSuccess(letterTypeResponseBody.letterType)
    );
  });

  test("dispatches snackbar message on failure", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}/referral-letter/letter-type`)
      .reply(500);

    await getLetterType(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the referral letter details were not loaded. Please try again."
      )
    );
  });
});
