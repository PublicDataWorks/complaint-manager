import { GET_OFFICER_HISTORY_OPTIONS_SUCCEEDED } from "../../../sharedUtilities/constants";

export const getOfficerHistoryOptionsRadioButtonValuesSuccess = officerHistoryOptions => ({
  type: GET_OFFICER_HISTORY_OPTIONS_SUCCEEDED,
  officerHistoryOptions
});
