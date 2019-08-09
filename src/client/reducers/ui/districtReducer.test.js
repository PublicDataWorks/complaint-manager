import { getDistrictsSuccess } from "../../actionCreators/districtsActionCreators";
import districtReducer from "./districtReducer";

describe("districtReducer", () => {
  test("should initialize to blank array", () => {
    const newState = districtReducer(undefined, {
      type: "RANDOM"
    });
    expect(newState).toEqual([]);
  });

  test("should set given districts in state", () => {
    const districts = [
      ["13th District", 13],
      ["1st District", 1],
      ["12th District", 12]
    ];

    const newState = districtReducer(undefined, getDistrictsSuccess(districts));

    expect(newState).toEqual(districts);
  });
});
