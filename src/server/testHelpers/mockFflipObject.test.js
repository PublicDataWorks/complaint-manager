import mockFflipObject from "./mockFflipObject";
import checkFeatureToggleEnabled from "../checkFeatureToggleEnabled";
const httpMocks = require("node-mocks-http");

describe("mockFflipObject", () => {
  test("toggles feature on correctly", () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      nickname: "nickname",
      fflip: mockFflipObject({
        testFeature: true
      })
    });

    expect(checkFeatureToggleEnabled(request, "testFeature")).toBeTruthy();
  });

  test("returns false if feature does not exist", () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      nickname: "nickname",
      fflip: mockFflipObject({})
    });

    expect(checkFeatureToggleEnabled(request, "testFeature")).toBeFalsy();
  });

  test("returns false if fflip is not on request", () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      nickname: "nickname"
    });

    expect(checkFeatureToggleEnabled(request, "testFeature")).toBeFalsy();
  });

  test("toggles feature off correctly", () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      nickname: "nickname",
      fflip: mockFflipObject({
        testFeature: false
      })
    });

    expect(checkFeatureToggleEnabled(request, "testFeature")).toBeFalsy();
  });
});
