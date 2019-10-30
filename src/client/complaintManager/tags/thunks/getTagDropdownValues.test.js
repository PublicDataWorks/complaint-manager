import nock from "nock";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import getAccessToken from "../../../common/auth/getAccessToken";
import getTagDropdownValues from "./getTagDropdownValues";
import { getTagsSuccess } from "../../actionCreators/tagActionCreators";

jest.mock("../../../common/auth/getAccessToken");

describe("getTagDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const hostname = "http://localhost";
  const apiRoute = "/api/tags";

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches tags and dispatches them", async () => {
    const responseBody = [["audrey", 1], ["tofu", 2], ["tom", 3]];

    nock(hostname)
      .get(apiRoute)
      .reply(200, responseBody);

    await getTagDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(getTagsSuccess(responseBody));
  });
});
