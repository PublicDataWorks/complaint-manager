import getAccessToken from "../../../../common/auth/getAccessToken";
import getRecommendedActions from "./getRecommendedActions";
import nock from "nock";
import { getRecommendedActionsSuccess } from "../../../actionCreators/letterActionCreators";
import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";

jest.mock("../../../../common/auth/getAccessToken");

describe("getRecommendedActions", function() {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });

  test("it fetches recommended action values and dispatches them", async () => {
    getAccessToken.mockImplementation(() => "token");
    const responseBody = [
      { id: 1, description: "description1" },
      { id: 2, description: "description2" }
    ];

    nock("http://localhost")
      .get("/api/recommended-actions")
      .reply(200, responseBody);

    await getRecommendedActions()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getRecommendedActionsSuccess(responseBody)
    );
  });
});
