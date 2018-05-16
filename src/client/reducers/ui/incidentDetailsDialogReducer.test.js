import incidentDetailsDialogReducer from "./incidentDetailsDialogReducer";
import { updateIncidentLocationAutoSuggest } from "../../actionCreators/casesActionCreators";

describe("incidentDetailsDialogReducer", () => {
  test("should set default state ", () => {
    const newState = incidentDetailsDialogReducer(undefined, { type: "" });
    const expectedState = {
      autoSuggestValue: ""
    };

    expect(newState).toEqual(expectedState);
  });

  test("should set autoSuggestValue when updated", () => {
    const initialState = { addressAutoSuggestValue: "initial value" };
    const newState = incidentDetailsDialogReducer(
      initialState,
      updateIncidentLocationAutoSuggest("new value")
    );

    expect(newState).toEqual({
      autoSuggestValue: "new value"
    });
  });
});
