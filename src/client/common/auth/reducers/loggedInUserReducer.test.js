import loggedInUserReducer from "./loggedInUserReducer";
import { userAuthSuccess } from "../actionCreators";

describe("loggedInUserReducer", () => {
  test("should set default state", () => {
    const newState = loggedInUserReducer(undefined, { type: "SOME_ACTION" });
    expect(newState.userInfo).toEqual({ nickname: "", permissions: [] });
  });
  test("should set nickname state when authentication was successful", () => {
    const newState = loggedInUserReducer(
      undefined,
      userAuthSuccess({ nickname: "the.dude", permissions: ["read:users"] })
    );
    expect(newState.userInfo).toEqual({
      nickname: "the.dude",
      permissions: ["read:users"]
    });
  });
});
