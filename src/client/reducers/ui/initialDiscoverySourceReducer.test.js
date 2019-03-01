import initialDiscoverySourceReducer from "./initialDiscoverySourceReducer";
import { getInitialDiscoverySourcesSuccess } from "../../actionCreators/initialDiscoverySourceActionCreators";

describe("initialDiscoverySourceReducer", () => {
  test("should initialize to blank array", () => {
    const newState = initialDiscoverySourceReducer(undefined, {
      type: "SOMETHING"
    });
    expect(newState).toEqual([]);
  });

  test("should set given initialDiscoverySources on state", () => {
    const newInitialDiscoverySources = [[0, "Facebook"], [1, "Friend"]];

    const newState = initialDiscoverySourceReducer(
      undefined,
      getInitialDiscoverySourcesSuccess(newInitialDiscoverySources)
    );

    expect(newState).toEqual(newInitialDiscoverySources);
  });
});
