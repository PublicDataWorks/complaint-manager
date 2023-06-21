import Auth from "./Auth";
import auditLogin from "../../policeDataManager/users/thunks/auditLogin";
import { mockLocalStorage } from "../../../mockLocalStorage";
import { generateRandomString } from "../../policeDataManager/utilities/generateRandomString";

jest.mock("../../policeDataManager/users/thunks/auditLogin");
jest.mock("../../policeDataManager/utilities/generateRandomString", () => {
  return jest.fn().mockImplementation(length => {
    return "iWalkedAThousandMiles";
  });
});
jest.mock("jsonwebtoken", () => ({
  decode: () => ({
    scope: "MOCK_SCOPE",
    perms: "MOCK_SCOPE",
    "https://noipm-staging.herokuapp.com/nickname": "MOCK_NICKNAME"
  })
}));
jest.mock("auth0-js", () => ({
  WebAuth: jest.fn(() => ({
    parseHash: jest.fn(callback =>
      callback(
        {},
        {
          accessToken: "AToken",
          idToken: "IToken",
          state: "iWalkedAThousandMiles"
        }
      )
    ),
    authorize: jest.fn(() => "iWalkedAThousandMiles")
  }))
}));
jest.mock("../../history", () => ({
  replace: jest.fn()
}));

describe("Auth", () => {
  const testNonce = "iWalkedAThousandMiles";
  let auth;

  beforeEach(() => {
    mockLocalStorage();
    auth = new Auth();
    window.localStorage.__proto__.getItem.mockReturnValue(testNonce);
  });

  test("should call audit login", () => {
    auth.handleAuthentication(jest.fn(), jest.fn());

    expect(auditLogin).toHaveBeenCalledTimes(1);
  });

  test("should call feature toggles callback", () => {
    const featureToggleCallback = jest.fn();
    auth.handleAuthentication(jest.fn(), featureToggleCallback);

    expect(featureToggleCallback).toHaveBeenCalled();
  });

  test("should redirect to url if correct nonce is authorized", () => {
    auth.login();
    expect(window.localStorage.__proto__.setItem).toHaveBeenCalledWith(
      "nonce",
      testNonce
    );

    auth.handleAuthentication(jest.fn(), jest.fn());
    expect(window.localStorage.__proto__.getItem).toHaveBeenCalledWith(
      "redirectUri"
    );
  });
  test("should not redirect if nonces don't match", () => {
    window.localStorage.__proto__.getItem.mockReturnValue("differentValue");
    auth.handleAuthentication(jest.fn(), jest.fn());
    expect(window.localStorage.__proto__.getItem).not.toHaveBeenCalledWith(
      "redirectUri"
    );
  });
});
