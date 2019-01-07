import raceEthnicityReducer from "./raceEthnicityReducer";
import { getRaceEthnicitiesSuccess } from "../../actionCreators/raceEthnicityActionCreators";

describe("raceEthnicityReducer", () => {
  test("should initialize to blank array", () => {
    const newState = raceEthnicityReducer(undefined, { type: "SOMETHING" });
    expect(newState).toEqual([]);
  });

  test("should set given raceEthnicities on state", () => {
    const raceEthnicities = [[0, "Filipino"], [1, "Samoan"]];

    const newState = raceEthnicityReducer(
      undefined,
      getRaceEthnicitiesSuccess(raceEthnicities)
    );

    expect(newState).toEqual(raceEthnicities);
  });
});
