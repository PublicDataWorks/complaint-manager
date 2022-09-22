import nock from "nock";
import getSigners from "./getSigners";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { GET_SIGNERS } from "../../../../sharedUtilities/constants";

jest.mock("../../../common/auth/getAccessToken", () => () => "TEST_TOKEN");

describe("getSigners thunk", function () {
  test("should dispatch success when configs fetched successfully", async () => {
    const mockDispatch = jest.fn();
    configureInterceptors({ dispatch: mockDispatch });
    const signers = [{}];
    nock("http://localhost").get(`/api/signers`).reply(200, signers);

    await getSigners()(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: GET_SIGNERS,
      payload: signers
    });
  });
});
