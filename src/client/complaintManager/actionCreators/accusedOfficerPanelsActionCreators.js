import {
  ACCUSED_OFFICER_PANEL_COLLAPSED,
  ACCUSED_OFFICER_PANEL_EXPANDED,
  OFFICER_PANEL_DATA_CLEARED
} from "../../../sharedUtilities/constants";

export const accusedOfficerPanelCollapsed = officerId => ({
  type: ACCUSED_OFFICER_PANEL_COLLAPSED,
  officerId
});
export const accusedOfficerPanelExpanded = officerId => ({
  type: ACCUSED_OFFICER_PANEL_EXPANDED,
  officerId
});

export const clearOfficerPanelData = () => ({
  type: OFFICER_PANEL_DATA_CLEARED
});
