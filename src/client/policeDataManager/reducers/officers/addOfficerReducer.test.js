import {
  addCaseEmployeeType,
  clearCaseEmployeeType
} from "../../actionCreators/officersActionCreators";
import addOfficerReducer from "./addOfficerReducer";

describe("addOfficerReducer", () => {
  describe("ADD_OFFICER", () => {
    test("Should set state to have case employee type", () => {
      const initialState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        caseEmployeeType: null
      };
      const caseEmployeeType = "EMPLOYEE";

      const newState = addOfficerReducer(
        initialState,
        addCaseEmployeeType(caseEmployeeType)
      );

      const expectedState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        caseEmployeeType
      };
      expect(newState).toEqual(expectedState);
    });
    test("Should clear case employee state", () => {
      const initialState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        caseEmployeeType: "OFFICER"
      };
      const newState = addOfficerReducer(initialState, clearCaseEmployeeType());

      const expectedState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        caseEmployeeType: null
      };

      expect(newState).toEqual(expectedState);
    });
  });
});
