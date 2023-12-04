import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";
import getAccessToken from "../../../../common/auth/getAccessToken";
import nock from "nock";
import getPriorityLevelDropdownValues from "./getPriorityLevelDropdownValues";
import { getPriorityLevelSuccess } from "../../../actionCreators/priorityLevelActionCreators";

jest.mock("../../../../common/auth/getAccessToken");

describe("getPriorityLevelDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const hostname = "http://localhost";
  const apiRoute = "/api/priority-levels";

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches priority level and dispatches them", async () => {
    const responseBody = [
      ["Priority One", 1],
      ["Priority Two", 2],
      ["Priority Three", 3]
    ];

    nock(hostname).get(apiRoute).reply(200, responseBody);

    await getPriorityLevelDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getPriorityLevelSuccess(responseBody)
    );
  });
});
