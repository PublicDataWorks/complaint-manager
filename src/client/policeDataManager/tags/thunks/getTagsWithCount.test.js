import nock from "nock";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import getAccessToken from "../../../common/auth/getAccessToken";
import getTagsWithCount from "./getTagsWithCount";
import { getTagsSuccess } from "../../actionCreators/tagActionCreators";

jest.mock("../../../common/auth/getAccessToken");

describe("getTagsWithCount", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const hostname = "http://localhost";
  const apiRoute = "/api/tags?expand=count";

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches tags and dispatches them", async () => {
    const responseBody = [
      { name: "audrey", id: 1, count: 4 },
      { name: "tofu", id: 2, count: 3 },
      { name: "tom", id: 3, count: 1 }
    ];

    nock(hostname).get(apiRoute).reply(200, responseBody);

    await getTagsWithCount()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(getTagsSuccess(responseBody));
  });

  test("it calls with additional sort param if given", async () => {
    const responseBody = [
      { name: "audrey", id: 1, count: 4 },
      { name: "tofu", id: 2, count: 3 },
      { name: "tom", id: 3, count: 1 }
    ];

    nock(hostname).get(`${apiRoute}&sort=name`).reply(200, responseBody);

    await getTagsWithCount("name")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(getTagsSuccess(responseBody));
  });

  test("it calls with additional sort param with direction if given", async () => {
    const responseBody = [
      { name: "audrey", id: 1, count: 4 },
      { name: "tofu", id: 2, count: 3 },
      { name: "tom", id: 3, count: 1 }
    ];

    nock(hostname).get(`${apiRoute}&sort=asc.count`).reply(200, responseBody);

    await getTagsWithCount("count", "asc")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(getTagsSuccess(responseBody));
  });
});
