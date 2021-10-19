import nock from "nock";
import getFeatureToggles from "./getFeatureToggles";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";

jest.mock("../../../common/auth/getAccessToken", () => () => "TEST_TOKEN");

describe("getFeatureToggles thunk", function () {
  test("should dispatch success when features fetched successfully", async () => {
    const mockDispatch = jest.fn();
    configureInterceptors({ dispatch: mockDispatch });
    const features = { testFeature: true };
    nock("https://localhost:1234")
      .options("/features")
      .reply(204, null, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization"
      });

    nock("https://localhost:1234").get(`/features`).reply(200, features);

    await getFeatureToggles()(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(getFeaturesSuccess(features));
  });
});
