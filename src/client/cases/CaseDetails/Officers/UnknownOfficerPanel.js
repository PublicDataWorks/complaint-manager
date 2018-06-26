import {
  Typography,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  IconButton,
  Icon
} from "@material-ui/core";
import React from "react";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";
import { ACCUSED } from "../../../../sharedUtilities/constants";
import styles from "../../../globalStyling/styles";
import OfficerAllegationsDisplay from "./OfficerAllegationsDisplay";
import {
  accusedOfficerPanelCollapsed,
  accusedOfficerPanelExpanded
} from "../../../actionCreators/accusedOfficerPanelsActionCreators";
import {connect} from "react-redux"

const UnknownOfficerPanel = ({ dispatch, caseOfficer, children }) => {
  return (
    <div>
      <ExpansionPanel
        data-test="unknownOfficerPanel"
        elevation={0}
        onChange={(event, expanded) => {
          expanded
            ? dispatch(accusedOfficerPanelExpanded(caseOfficer.id))
            : dispatch(accusedOfficerPanelCollapsed(caseOfficer.id));
        }}
        style={{ backgroundColor: "white" }}
      >
        <ExpansionPanelSummary style={{ padding: "0px 24px" }}>
          <div style={{ display: "flex", width: "100%", paddingRight: 0 }}>
            <IconButton
              style={{ marginRight: 16 }}
              color="secondary"
              className="chevron-right"
            >
              <Icon>unfold_more</Icon>
            </IconButton>
            <OfficerInfoDisplay
              displayLabel="Officer"
              value={caseOfficer.fullName}
              testLabel="officerName"
            />
            {children}
          </div>
        </ExpansionPanelSummary>
        <StyledExpansionPanelDetails>
          <OfficerInfoDisplay
            displayLabel="Notes"
            value={caseOfficer.notes}
            testLabel="notes"
          />
        </StyledExpansionPanelDetails
        >
        {caseOfficer &&
          caseOfficer.roleOnCase === ACCUSED && (
            <div
              style={{
                marginLeft: '64px'
              }}>
              <Typography
                style={{
                  ...styles.section,
                  margin: "8px 24px"
                }}
              >
                Allegations
              </Typography>
              {caseOfficer.allegations.length > 0 ? (
                <OfficerAllegationsDisplay
                  officerId={caseOfficer.id}
                  officerAllegations={caseOfficer.allegations}
                />
              ) : (
                <Typography style={{ marginLeft: "24px", fontStyle: "italic" }}>
                  No allegations have been added.
                </Typography>
              )}
            </div>
          )}
      </ExpansionPanel>
      <Divider />
    </div>
  );
};

export default connect()(UnknownOfficerPanel);
