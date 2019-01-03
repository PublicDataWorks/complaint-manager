import configureInterceptors from "./interceptors";
import nock from "nock";
import { push } from "react-router-redux";
import axios from "axios/index";

jest.mock("../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("unauthorizedResponseInterceptor", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("redirects to login on 401 response and still throw error for thunks", async () => {
    nock("http://localhost")
      .get("/api/something")
      .reply(401, { error: "Unauthorized" });

    try {
      await axios.get("/api/something");
    } catch (error) {
      expect(error.message).toEqual("Request failed with status code 401");
    }
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("does not redirect to login on 200 response", async () => {
    nock("http://localhost")
      .get("/api/something")
      .reply(200);

    await axios.get("http://localhost/api/something");

    expect(dispatch).not.toHaveBeenCalledWith(push("/login"));
  });
});
