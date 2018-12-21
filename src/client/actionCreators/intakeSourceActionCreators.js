import { GET_INTAKE_SOURCES_SUCCEEDED } from "../../sharedUtilities/constants";

export const getIntakeSourcesSuccess = intakeSources => ({
  type: GET_INTAKE_SOURCES_SUCCEEDED,
  intakeSources
});
