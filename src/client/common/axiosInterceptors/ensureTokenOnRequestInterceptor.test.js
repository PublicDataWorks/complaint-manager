import getWorkingCases from "../../policeDataManager/cases/thunks/getWorkingCases";
import nock from "nock";
import { getWorkingCasesSuccess } from "../../policeDataManager/actionCreators/casesActionCreators";
import getAccessToken from "../auth/getAccessToken";
import { push } from "connected-react-router";
import configureInterceptors from "./interceptors";
import { mockLocalStorage } from "../../../mockLocalStorage";
import ensureTokenOnRequestInterceptor from "./ensureTokenOnRequestInterceptor";
import { isAuthDisabled } from "../../isAuthDisabled";
import { authEnabledTest } from "../../testHelpers";
import CountComplaintsByIntakeSource from "../components/Visualization/models/countComplaintsByIntakeSource.model";

jest.mock("../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("ensureTokenOnRequestInterceptor", () => {
  const dispatch = jest.fn();
  const responseBody = { cases: { rows: ["some case"], count: 1 } };
  const sortBy = "sortBy";
  const sortDirection = "sortDirection";
  const expirationTime = "0";
  const queryType = "countComplaintsByIntakeSource";

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
    getAccessToken.mockClear();
    mockLocalStorage();
  });

  describe("auth test(s)", () => {
    const test = authEnabledTest();
    test("should skip adding access token to request headers on public routes", async () => {
      nock("http://localhost", {
        badheaders: ["authorization"]
      })
        .get(`/api/public-data?queryType=${queryType}`)
        .reply(function () {
          return [200, {}];
        });

      nock("http://localhost")
        .get(`/api/public-data?queryType=${queryType}`)
        .reply(function () {
          throw new Error("Error: Authorization header present on request");
        });

      await new CountComplaintsByIntakeSource().getVisualizationData({
        isPublic: true
      });
    });

    test("should add access token to request headers on non-public routes", async () => {
      nock("http://localhost")
        .get(`/api/cases?sortBy=${sortBy}&sortDirection=${sortDirection}`)
        .reply(function () {
          if (this.req.headers.authorization === `Bearer ${getAccessToken()}`)
            return [200, responseBody];
          return [401];
        });

      await getWorkingCases(sortBy, sortDirection)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        getWorkingCasesSuccess(
          responseBody.cases.rows,
          responseBody.cases.count
        )
      );
      expect(dispatch).not.toHaveBeenCalledWith(push("/login"));
    });

    test("should redirect to login when missing access token", async () => {
      getAccessToken.mockImplementation(() => false);

      nock("http://localhost")
        .get(`/api/cases?sortBy=${sortBy}&sortDirection=${sortDirection}`)
        .reply(200);

      await getWorkingCases(sortBy, sortDirection)(dispatch);

      expect(dispatch).not.toHaveBeenCalledWith(
        getWorkingCasesSuccess(responseBody.cases)
      );
      expect(dispatch).toHaveBeenCalledWith(push("/login"));
    });

    test("should store pathname in local storage if no previous access token", async () => {
      const redirectUri = `/api/cases`;
      getAccessToken.mockImplementation(() => false);

      delete global.window.location;

      global.window.location = {
        port: "3000",
        protocol: "http:",
        hostname: "localhost",
        pathname: redirectUri
      };

      await getWorkingCases(sortBy, sortDirection)(dispatch);

      expect(window.localStorage.__proto__.setItem).toHaveBeenCalledWith(
        "redirectUri",
        redirectUri
      );

      expect(dispatch).toHaveBeenCalledWith(push("/login"));
    });
  });

  test("should remove access token from local storage if it has expired", async () => {
    const redirectUri = `/api/cases`;
    window.localStorage.__proto__.getItem.mockReturnValue(expirationTime);
    delete global.window.location;
    global.window.location = {
      port: "3000",
      protocol: "http:",
      hostname: "localhost",
      pathname: redirectUri
    };

    await getWorkingCases(sortBy, sortDirection)(dispatch);
    expect(window.localStorage.__proto__.removeItem).toHaveBeenCalledWith(
      "access_token"
    );
  });

  test("should not store pathname in local storage if redirectUri is /login", async () => {
    const redirectUri = `/login`;
    getAccessToken.mockImplementation(() => false);

    delete global.window.location;

    global.window.location = {
      port: "3000",
      protocol: "http:",
      hostname: "localhost",
      pathname: redirectUri
    };

    await getWorkingCases(sortBy, sortDirection)(dispatch);

    expect(window.localStorage.__proto__.setItem).not.toHaveBeenCalled();
  });
});
