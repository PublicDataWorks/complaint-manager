import nock from "nock";
import getConfigs from "./getConfigs";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { GET_CONFIGS_SUCCEEDED } from "../../../../sharedUtilities/constants";

jest.mock("../../../common/auth/getAccessToken", () => () => "TEST_TOKEN");

describe("getConfigs thunk", function () {
  test("should dispatch success when configs fetched successfully", async () => {
    const mockDispatch = jest.fn();
    configureInterceptors({ dispatch: mockDispatch });
    const configs = { testConfig: true };
    nock("http://localhost").get(`/api/configs`).reply(200, configs);

    await getConfigs()(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: GET_CONFIGS_SUCCEEDED,
      payload: configs
    });
  });
});
