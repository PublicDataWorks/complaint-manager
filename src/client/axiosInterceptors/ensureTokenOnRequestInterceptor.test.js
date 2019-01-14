import getCases from "../cases/thunks/getCases";
import nock from "nock";
import { getCasesSuccess } from "../actionCreators/casesActionCreators";
import getAccessToken from "../auth/getAccessToken";
import { push } from "connected-react-router";
import configureInterceptors from "./interceptors";

jest.mock("../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("ensureTokenOnRequestInterceptor", () => {
  const dispatch = jest.fn();
  const responseBody = { cases: ["some case"] };

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
    getAccessToken.mockClear();
  });

  test("adds access token to request headers", async () => {
    nock("http://localhost")
      .get("/api/cases")
      .reply(function() {
        if (this.req.headers.authorization == `Bearer ${getAccessToken()}`)
          return [200, responseBody];
        return [401];
      });

    await getCases()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(getCasesSuccess(responseBody.cases));
    expect(dispatch).not.toHaveBeenCalledWith(push("/login"));
  });

  test("should redirect to login when missing access token", async () => {
    getAccessToken.mockImplementation(() => false);

    nock("http://localhost")
      .get("/api/cases")
      .reply(200);

    await getCases()(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      getCasesSuccess(responseBody.cases)
    );
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });
});
