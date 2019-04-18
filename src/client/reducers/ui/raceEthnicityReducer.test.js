import raceEthnicityReducer from "./raceEthnicityReducer";
import { getRaceEthnicitiesSuccess } from "../../actionCreators/raceEthnicityActionCreators";

describe("raceEthnicityReducer", () => {
  test("should initialize to blank array", () => {
    const newState = raceEthnicityReducer(undefined, { type: "SOMETHING" });
    expect(newState).toEqual([]);
  });

  test("should set given raceEthnicities on state", () => {
    const raceEthnicities = [["Filipino", 0], ["Samoan", 1]];

    const newState = raceEthnicityReducer(
      undefined,
      getRaceEthnicitiesSuccess(raceEthnicities)
    );

    expect(newState).toEqual(raceEthnicities);
  });
});
