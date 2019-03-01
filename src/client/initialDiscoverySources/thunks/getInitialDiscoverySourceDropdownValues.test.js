import configureInterceptors from "../../axiosInterceptors/interceptors";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import getInitialDiscoverySourceDropdownValues from "./getInitialDiscoverySourceDropdownValues";
import { getInitialDiscoverySourcesSuccess } from "../../actionCreators/initialDiscoverySourceActionCreators";

jest.mock("../../auth/getAccessToken");

describe("getIntakeSourceDropdownValues", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const hostname = "http://localhost";
  const apiRoute = "/api/initial-discovery-sources";

  beforeEach(async () => {
    getAccessToken.mockImplementation(() => "token");
  });

  test("it fetches initial discovery sources and dispatches them", async () => {
    const responseBody = [[1, "Facebook"], [2, "Friend"], [3, "NOIPM Website"]];

    nock(hostname)
      .get(apiRoute)
      .reply(200, responseBody);

    await getInitialDiscoverySourceDropdownValues()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getInitialDiscoverySourcesSuccess(responseBody)
    );
  });
});
