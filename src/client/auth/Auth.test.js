import Auth from "./Auth";
import auditLogin from "../users/thunks/auditLogin";
import { mockLocalStorage } from "../../mockLocalStorage";
import config from "../config/config";

jest.mock("../users/thunks/auditLogin");
jest.mock("jsonwebtoken", () => ({
  decode: () => ({
    scope: "MOCK_SCOPE",
    "https://noipm-staging.herokuapp.com/nickname": "MOCK_NICKNAME",
    "https://noipm-staging.herokuapp.com/roles": null
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

  test("should set roles to an empty list if none found", () => {
    mockLocalStorage();
    const auth = new Auth();

    const actionCreator = jest.fn()

    auth.handleAuthentication(actionCreator);

    expect(actionCreator).toHaveBeenCalledWith({nickname: 'MOCK_NICKNAME', roles:[], permissions:["MOCK_SCOPE"]})
  })
});
