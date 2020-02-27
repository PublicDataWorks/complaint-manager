import { getUsersSuccess } from "../../actionCreators/usersActionCreators";
import usersReducer from "./usersReducer";

describe("userReducer", () => {
  test("should initialize to blank array", () => {
    const newState = usersReducer(undefined, {
      type: "RANDOM"
    });
    expect(newState).toEqual([]);
  });

  test("should return state for unhandled actions", () => {
    const newState = usersReducer(["Blah"], {
      type: "RANDOM"
    });
    expect(newState).toEqual(["Blah"]);
  });

  test("should set given users in state", () => {
    const users = [
      { name: "Obama", email: "yeswecan@obama.com" },
      { name: "Trump", email: "maga@trump.com" },
      { name: "Hilary", email: "idontuseemail@clinton.com" }
    ];

    const newState = usersReducer(undefined, getUsersSuccess(users));

    expect(newState).toEqual(users);
  });
});
