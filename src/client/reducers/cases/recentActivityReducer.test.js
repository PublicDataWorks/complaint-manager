import recentActivityReducer from "./recentActivityReducer";
import {
  addCaseNoteSuccess,
  editCaseNoteSuccess,
  getRecentActivitySuccess,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";

describe("recentActivityReducer", () => {
  test("should set default state", () => {
    const newState = recentActivityReducer(undefined, { type: "SOME_ACTION" });

    expect(newState).toEqual([]);
  });

  test("should return recent activity array after successful get", () => {
    const expectedRecentActivity = ["action 1", "action 2"];
    const newState = recentActivityReducer(
      [],
      getRecentActivitySuccess(expectedRecentActivity)
    );

    expect(newState).toEqual(expectedRecentActivity);
  });

  test("should return recent activity after case note logged", () => {
    const expectedRecentActivity = ["action 1", "action 2"];

    const newState = recentActivityReducer(
      [],
      addCaseNoteSuccess(expectedRecentActivity)
    );
    expect(newState).toEqual(expectedRecentActivity);
  });

  test("should replace recent activity after removing case note", () => {
    const oldState = { some: "old state" };

    const caseNoteDetails = {
      details: {
        some: "new state"
      },
      recentActivity: {
        not: "copied over"
      }
    };

    const newState = recentActivityReducer(
      oldState,
      removeCaseNoteSuccess(caseNoteDetails)
    );

    expect(newState).toEqual(caseNoteDetails.recentActivity);
  });

  test("should replace recent activity after editing case note", () => {
    const oldState = { some: "old state" };

    const caseNoteDetails = {
      some: "new state"
    };

    const newState = recentActivityReducer(
      oldState,
      editCaseNoteSuccess(caseNoteDetails)
    );

    expect(newState).toEqual(caseNoteDetails);
  });
});
