import getAccessToken from "../../../auth/getAccessToken";
import { push } from "connected-react-router";
import getRecommendedActions from "./getRecommendedActions";
import nock from "nock";
import { getRecommendedActionsSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

jest.mock("../../../auth/getAccessToken");

describe("getRecommendedActions", function() {
  const dispatch = jest.fn();

  test("it redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => false);
    await getRecommendedActions()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

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
