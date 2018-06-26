import Auth from "./Auth";
import auditLogin from "../users/thunks/auditLogin";
import { mockLocalStorage } from "../../mockLocalStorage";

jest.mock("../users/thunks/auditLogin");
jest.mock("jsonwebtoken", () => ({
  decode: () => ({
    scope: "MOCK_SCOPE",
    "https://noipm-staging.herokuapp.com/nickname": "MOCK_NICKNAME"
  })
}));
jest.mock("auth0-js", () => ({
  WebAuth: jest.fn(() => ({
    parseHash: jest.fn(callback =>
      callback({}, { accessToken: "AToken", idToken: "IToken" })
    )
  }))
}));

describe("Auth", () => {
  test("should call audit login", () => {
    mockLocalStorage();
    const auth = new Auth();

    auth.handleAuthentication(jest.fn());

    expect(auditLogin).toHaveBeenCalledTimes(1);
  });
});
