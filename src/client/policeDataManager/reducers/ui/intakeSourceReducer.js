import { GET_INTAKE_SOURCES_SUCCEEDED } from "../../../../sharedUtilities/constants";

const initialState = [];

const intakeSourceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INTAKE_SOURCES_SUCCEEDED:
      return action.intakeSources;
    default:
      return state;
  }
};

export default intakeSourceReducer;
