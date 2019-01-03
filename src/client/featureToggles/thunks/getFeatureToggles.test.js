import nock from "nock";
import getFeatureToggles from "./getFeatureToggles";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => () => "TEST_TOKEN");

describe("getFeatureToggles thunk", function() {
  test("should dispatch success when features fetched successfully", async () => {
    const mockDispatch = jest.fn();
    configureInterceptors({ dispatch: mockDispatch });
    const features = { testFeature: true };
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get(`/features`)
      .reply(200, features);

    await getFeatureToggles()(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledWith(getFeaturesSuccess(features));
  });
});
