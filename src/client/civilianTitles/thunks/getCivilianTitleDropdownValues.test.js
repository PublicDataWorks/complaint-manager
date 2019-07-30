import getAccessToken from "../../auth/getAccessToken";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import nock from "nock";
import getCivilianTitleDropdownValues from "./getCivilianTitleDropdownValues";
import { getCivilianTitlesSuccess } from "../../actionCreators/civilianTitleActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getCivilianTitleDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches civilian title values and dispatches them", async () => {
    const responseBody = [["N/A", 1], ["Dr.", 2], ["Miss", 3], ["Mrs.", 4]];

    nock("http://localhost")
      .get("/api/civilian-titles")
      .reply(200, responseBody);

    await getCivilianTitleDropdownValues()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getCivilianTitlesSuccess(responseBody)
    );
  });
});
