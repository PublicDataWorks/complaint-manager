import {
  addCaseEmployeeType,
  clearCaseEmployeeType
} from "../../actionCreators/officersActionCreators";
import addOfficerReducer from "./addOfficerReducer";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("addOfficerReducer", () => {
  describe("ADD_OFFICER", () => {
    test("Should set state to have case employee type", () => {
      const initialState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        caseEmployeeType: null
      };
      const caseEmployeeType =
        PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription;

      const newState = addOfficerReducer(
        initialState,
        addCaseEmployeeType(caseEmployeeType)
      );

      const expectedState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        caseEmployeeType: PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
      };
      expect(newState).toEqual(expectedState);
    });
    test("Should clear case employee state", () => {
      const initialState = {
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        caseEmployeeType: PERSON_TYPE.UNKNOWN_OFFICER.employeeDescription
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
