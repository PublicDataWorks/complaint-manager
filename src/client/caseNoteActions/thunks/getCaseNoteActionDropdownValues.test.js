import configureInterceptors from "../../axiosInterceptors/interceptors";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import getCaseNoteActionDropdownValues from "./getCaseNoteActionDropdownValues";
import { getCaseNoteActionsSuccess } from "../../actionCreators/caseNoteActionActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getCaseNoteActionDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches gender identity values and dispatches them", async () => {
    const responseBody = [
      ["Sent supplemental complaint referral", 1],
      ["Requested documents from other agency", 2],
      ["Memo to file", 3]
    ];

    nock("http://localhost")
      .get("/api/case-note-actions")
      .reply(200, responseBody);

    await getCaseNoteActionDropdownValues()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getCaseNoteActionsSuccess(responseBody)
    );
  });
});
