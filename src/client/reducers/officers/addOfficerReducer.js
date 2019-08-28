import {
  ADD_CASE_EMPLOYEE_TYPE,
  CLEAR_CASE_EMPLOYEE_TYPE
} from "../../../sharedUtilities/constants";

const initialState = {
  caseEmployeeType: null
};

const addOfficerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CASE_EMPLOYEE_TYPE:
      return {
        ...state,
        caseEmployeeType: action.caseEmployeeType
      };
    case CLEAR_CASE_EMPLOYEE_TYPE:
      return {
        ...state,
        caseEmployeeType: null
      };
    default:
      return state;
  }
};

export default addOfficerReducer;
