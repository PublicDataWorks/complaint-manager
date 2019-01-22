import { push } from "connected-react-router";
import editReferralLetterContent from "./editReferralLetterContent";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import nock from "nock";
import getAccessToken from "../../../auth/getAccessToken";
import configureInterceptors from "../../../axiosInterceptors/interceptors";

jest.mock("../../../auth/getAccessToken");

describe("editReferralLetterContent" + "", () => {
  const redirectUrl = "url";
  const caseId = 9;
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const referralLetterHtml = "<p>Some html content</p>";

  test("redirects to preview page and shows success on success", async () => {
    getAccessToken.mockImplementation(() => "token");
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer token`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/content`, referralLetterHtml)
      .reply(200);
    await editReferralLetterContent(caseId, referralLetterHtml, redirectUrl)(
      dispatch
    );

    expect(dispatch).toHaveBeenCalledWith(push(redirectUrl));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Letter was successfully updated")
    );
  });
});
