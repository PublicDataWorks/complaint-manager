import accusedOfficerPanelsReducer from "./accusedOfficerPanelsReducer";
import {
  accusedOfficerPanelCollapsed,
  accusedOfficerPanelExpanded,
  clearOfficerPanelData
} from "../../actionCreators/accusedOfficerPanelsActionCreators";

describe("accusedOfficerPanelsReducer", () => {
  test("should render default state", () => {
    const actualState = accusedOfficerPanelsReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(actualState).toEqual({});
  });

  test("should track state when collapsing officer panels", () => {
    const anOfficerId = 12;
    const anotherOfficerId = 14;

    let actualState = accusedOfficerPanelsReducer(
      {},
      accusedOfficerPanelCollapsed(anOfficerId)
    );
    actualState = accusedOfficerPanelsReducer(
      actualState,
      accusedOfficerPanelCollapsed(anotherOfficerId)
    );
    expect(actualState).toEqual({
      [anOfficerId]: { collapsed: true },
      [anotherOfficerId]: { collapsed: true }
    });
  });

  test("should track state when expanding officer panels", () => {
    const anOfficerId = 12;
    const anotherOfficerId = 14;

    let actualState = accusedOfficerPanelsReducer(
      {},
      accusedOfficerPanelExpanded(anOfficerId)
    );
    actualState = accusedOfficerPanelsReducer(
      actualState,
      accusedOfficerPanelExpanded(anotherOfficerId)
    );
    expect(actualState).toEqual({
      [anOfficerId]: { collapsed: false },
      [anotherOfficerId]: { collapsed: false }
    });
  });

  test("should clear state when officer panel data is cleared out", () => {
    const initialState = {
      1: { expanded: true },
      2: { expanded: false },
      3: { expanded: true }
    };

    const expectedState = {};
    const actualState = accusedOfficerPanelsReducer(
      initialState,
      clearOfficerPanelData()
    );

    expect(actualState).toEqual(expectedState);
  });
});
