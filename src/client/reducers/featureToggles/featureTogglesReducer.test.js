import featureTogglesReducer from "./featureTogglesReducer";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";

describe("featureTogglesReducer", function() {
  test("should set initial state", () => {
    const actualState = featureTogglesReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(actualState).toEqual({});
  });

  test("should set state to given features", () => {
    const newFeatures = { someFeature: true, someOtherFeature: false };
    const newState = featureTogglesReducer({}, getFeaturesSuccess(newFeatures));
    expect(newState).toEqual(newFeatures);
  });
});
