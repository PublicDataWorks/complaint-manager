import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";
import getAccessToken from "../../../../common/auth/getAccessToken";
import nock from "nock";
import getClassificationOptions from "./getClassificationOptions";
import { getClassificationsSuccess } from "../../../actionCreators/letterActionCreators";

jest.mock("../../../../common/auth/getAccessToken");

describe("getClassificationOptions", function() {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });

  test("it fetches classification options and dispatches them", async () => {
    getAccessToken.mockImplementation(() => "token");
    const responseBody = [
      { name: "Use of Force", message: "forceful" },
      { name: "Misconduct", message: "incorrect" }
    ];

    nock("http://localhost")
      .get("/api/classifications")
      .reply(200, responseBody);

    await getClassificationOptions()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getClassificationsSuccess(responseBody)
    );
  });
});
