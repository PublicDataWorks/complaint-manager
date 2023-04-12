import {
  CLEAR_SELECTED_INMATE,
  SET_SELECTED_INMATE
} from "../../../sharedUtilities/constants";

export const selectInmate = (inmate, roleOnCase) => ({
  type: SET_SELECTED_INMATE,
  payload: { inmate, roleOnCase }
});

export const removeSelectedInmate = () => ({
  type: CLEAR_SELECTED_INMATE
});
