import getWorkingCases from "../cases/thunks/getWorkingCases";
import nock from "nock";
import { getWorkingCasesSuccess } from "../actionCreators/casesActionCreators";
import getAccessToken from "../auth/getAccessToken";
import { push } from "connected-react-router";
import configureInterceptors from "./interceptors";
import { mockLocalStorage } from "../../mockLocalStorage";
import ensureTokenOnRequestInterceptor from "./ensureTokenOnRequestInterceptor";
import axios from "axios/index";

jest.mock("../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("ensureTokenOnRequestInterceptor", () => {
  const dispatch = jest.fn();
  const responseBody = { cases: { rows: ["some case"], count: 1 } };
  const sortBy = "sortBy";
  const sortDirection = "sortDirection";
  const expirationTime = "0";

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
    getAccessToken.mockClear();
    mockLocalStorage();
  });

  test("adds access token to request headers", async () => {
    nock("http://localhost")
      .get(`/api/cases?sortBy=${sortBy}&sortDirection=${sortDirection}`)
      .reply(function() {
        if (this.req.headers.authorization === `Bearer ${getAccessToken()}`)
          return [200, responseBody];
        return [401];
      });

    await getWorkingCases(sortBy, sortDirection)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getWorkingCasesSuccess(responseBody.cases.rows, responseBody.cases.count)
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

  test("should store pathname in local storage if access token has expired", async () => {
    getAccessToken.mockImplementation(() => true);
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
    expect(window.localStorage.__proto__.setItem).toHaveBeenCalledWith(
      "redirectUri",
      redirectUri
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
