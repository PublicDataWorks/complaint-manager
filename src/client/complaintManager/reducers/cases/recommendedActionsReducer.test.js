import recommendedActionsReducer from "./recommendedActionsReducer";
import { getRecommendedActionsSuccess } from "../../actionCreators/letterActionCreators";

describe("recommendedActionsReducer", function() {
  test("should initialize to blank array", () => {
    const newState = recommendedActionsReducer(undefined, {
      type: "SOMETHING"
    });
    expect(newState).toEqual([]);
  });

  test("should set given recommended actions in state", () => {
    const recommendedActions = [
      { id: 1, description: "action1" },
      { id: 2, description: "action2" }
    ];
    const newState = recommendedActionsReducer(
      undefined,
      getRecommendedActionsSuccess(recommendedActions)
    );
    expect(newState).toEqual(recommendedActions);
  });
});
