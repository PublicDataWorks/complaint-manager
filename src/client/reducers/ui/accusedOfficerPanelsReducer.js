import {
  ACCUSED_OFFICER_PANEL_COLLAPSED,
  ACCUSED_OFFICER_PANEL_EXPANDED,
  OFFICER_PANEL_DATA_CLEARED
} from "../../../sharedUtilities/constants";

const accusedOfficerPanelsReducer = (state = {}, action) => {
  switch (action.type){
    case ACCUSED_OFFICER_PANEL_COLLAPSED: {
      return {
        ...state,
        [action.officerId]: {
          collapsed: true
        }
      }
    }
    case ACCUSED_OFFICER_PANEL_EXPANDED: {
      return {
        ...state,
        [action.officerId]: {
          collapsed: false
        }
      }
    }
    case OFFICER_PANEL_DATA_CLEARED: {
      return {}
    }
    default:
      return state
  }
}

export default accusedOfficerPanelsReducer