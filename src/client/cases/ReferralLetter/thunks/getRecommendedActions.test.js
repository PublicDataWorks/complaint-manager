import getAccessToken from "../../../auth/getAccessToken";
import getRecommendedActions from "./getRecommendedActions";
import nock from "nock";
import { getRecommendedActionsSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import configureInterceptors from "../../../axiosInterceptors/interceptors";

jest.mock("../../../auth/getAccessToken");

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

  test("it dispatches failure when api call fails", async () => {
    getAccessToken.mockImplementation(() => "token");

    nock("http://localhost")
      .get("/api/recommended-actions")
      .reply(500);

    await getRecommendedActions()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and we could not fetch the recommended actions."
      )
    );
  });
});
