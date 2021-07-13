import { getCaseNoteActionsSuccess } from "../../actionCreators/caseNoteActionActionCreators";
import caseNoteActionReducer from "./caseNoteActionReducer";
import PD from "../../../../instance-files/constants"

describe("caseNoteActionReducer", () => {
  test("should initialize to blank array", () => {
    const newState = caseNoteActionReducer(undefined, {
      type: "Something"
    });
    expect(newState).toEqual([]);
  });

  test("should set given caseNoteActions on state", () => {
    const caseNoteActions = [
      [`Case briefing from ${PD}`, 0],
      ["Checked status", 1],
      ["Contacted outside agency", 2]
    ];

    const newState = caseNoteActionReducer(
      undefined,
      getCaseNoteActionsSuccess(caseNoteActions)
    );

    expect(newState).toEqual(caseNoteActions);
  });
});
