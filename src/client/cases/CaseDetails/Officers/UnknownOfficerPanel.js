import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  Icon,
  IconButton,
  Typography
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
import { connect } from "react-redux";

const UnknownOfficerPanel = ({ dispatch, caseOfficer, children }) => {
  return (
    <div data-test="unknownOfficerPanel">
      <div style={{ display: "flex", width: "100%", paddingRight: 0 }}>
        <ExpansionPanel
          elevation={0}
          onChange={(event, expanded) => {
            expanded
              ? dispatch(accusedOfficerPanelExpanded(caseOfficer.id))
              : dispatch(accusedOfficerPanelCollapsed(caseOfficer.id));
          }}
          style={{ backgroundColor: "white", width: "100%" }}
        >
          <ExpansionPanelSummary style={{ padding: "0px 24px" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                paddingRight: 0,
                marginBottom: 4
              }}
            >
              <div style={{ width: "36px", marginRight: 16 }}>
                <IconButton
                  style={{ height: "36px", width: "36px" }}
                  color="secondary"
                  className="chevron-right"
                >
                  <Icon>unfold_more</Icon>
                </IconButton>
              </div>
              <OfficerInfoDisplay
                displayLabel="Officer"
                value={caseOfficer.fullName}
                testLabel="officerName"
              />
            </div>
          </ExpansionPanelSummary>
          <StyledExpansionPanelDetails>
            <OfficerInfoDisplay
              displayLabel="Notes"
              value={caseOfficer.notes}
              testLabel="notes"
            />
          </StyledExpansionPanelDetails>
          {caseOfficer && caseOfficer.roleOnCase === ACCUSED && (
            <div
              style={{
                marginLeft: "52px"
              }}
            >
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
        <div style={{ margin: "12px 24px" }}>{children}</div>
      </div>
      <Divider />
    </div>
  );
};

export default connect()(UnknownOfficerPanel);
