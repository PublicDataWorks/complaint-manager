import getCases from "./cases/thunks/getCases";
import nock from "nock";
import { getCasesSuccess } from "./actionCreators/casesActionCreators";
import getAccessToken from "./auth/getAccessToken";
import { push } from "connected-react-router";
import configureInterceptors from "./interceptors";
jest.mock("./auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("interceptors", () => {
  const mockStore = { dispatch: jest.fn() };
  const responseBody = { users: ["some user"] };

  beforeEach(() => {
    configureInterceptors(mockStore);
    getAccessToken.mockClear();
    mockStore.dispatch.mockClear();
  });

  test("should redirect to login on 401", async () => {
    getAccessToken.mockImplementation(() => true);

    nock("http://localhost")
      .get("/api/cases")
      .reply(401, { error: "Unauthorized" });

    await getCases()(mockStore.dispatch);

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(
      getCasesSuccess(responseBody.users)
    );
    expect(mockStore.dispatch).toHaveBeenCalledWith(push("/login"));
  });
});
