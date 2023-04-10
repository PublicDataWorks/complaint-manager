import React from "react";
import { connect } from "react-redux";
import {
  Divider,
  Accordion,
  AccordionSummary,
  Typography
} from "@material-ui/core";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../StyledExpansionPanelDetails";
import { ACCUSED } from "../../../../../../sharedUtilities/constants";
import styles from "../../../../../common/globalStyling/styles";
import OfficerAllegationsDisplay from "./OfficerAllegationsDisplay";
import {
  accusedOfficerPanelCollapsed,
  accusedOfficerPanelExpanded
} from "../../../../actionCreators/accusedOfficerPanelsActionCreators";
import ExpansionPanelIconButton from "../../../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../../../shared/components/StyledInfoDisplay";
import formatPhoneNumber from "../../../../../../sharedUtilities/formatPhoneNumber";

const UnknownOfficerPanel = ({ dispatch, caseOfficer, children }) => {
  const phoneNumber = formatPhoneNumber(caseOfficer.phoneNumber);
  return (
    <div data-testid="unknownOfficerPanel">
      <div style={{ display: "flex", width: "100%", paddingRight: 0 }}>
        <Accordion
          elevation={0}
          onChange={(event, expanded) => {
            expanded
              ? dispatch(accusedOfficerPanelExpanded(caseOfficer.id))
              : dispatch(accusedOfficerPanelCollapsed(caseOfficer.id));
          }}
          style={{ backgroundColor: "white", width: "100%" }}
        >
          <AccordionSummary style={{ padding: "0px 24px" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                paddingRight: 0,
                marginBottom: 4
              }}
            >
              <ExpansionPanelIconButton />
              <StyledInfoDisplay>
                <OfficerInfoDisplay
                  displayLabel="Officer"
                  value={caseOfficer.fullName}
                  testLabel="officerName"
                />
              </StyledInfoDisplay>
            </div>
          </AccordionSummary>
          {caseOfficer && caseOfficer.roleOnCase !== ACCUSED && (
            <StyledExpansionPanelDetails>
              <StyledInfoDisplay>
                <OfficerInfoDisplay
                  displayLabel="Phone Number"
                  value={phoneNumber}
                  testLabel="phoneNumber"
                />
              </StyledInfoDisplay>
              <StyledInfoDisplay>
                <OfficerInfoDisplay
                  displayLabel="Email"
                  value={caseOfficer.email}
                  testLabel="email"
                />
              </StyledInfoDisplay>
              <StyledInfoDisplay />
            </StyledExpansionPanelDetails>
          )}
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Notes"
                value={caseOfficer.notes}
                testLabel="notes"
              />
            </StyledInfoDisplay>
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
        </Accordion>
        <div style={{ margin: "12px 24px" }}>{children}</div>
      </div>
      <Divider />
    </div>
  );
};

export default connect()(UnknownOfficerPanel);
