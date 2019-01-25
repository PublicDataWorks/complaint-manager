import React from "react";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  Icon,
  IconButton,
  Typography
} from "@material-ui/core";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";
import formatDate from "../../../utilities/formatDate";
import OfficerNameDisplay from "./OfficerNameDisplay";
import OfficerAllegationsDisplay from "./OfficerAllegationsDisplay";
import styles from "../../../globalStyling/styles";
import { ACCUSED } from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import {
  accusedOfficerPanelCollapsed,
  accusedOfficerPanelExpanded
} from "../../../actionCreators/accusedOfficerPanelsActionCreators";
import DateOfBirthAgeInfoDisplay from "../../../shared/components/DateOfBirthAgeInfoDisplay";

const OfficerPanel = ({ dispatch, caseOfficer, officerAge, children }) => (
  <div>
    <div
      data-test="knownOfficerPanel"
      style={{ display: "flex", width: "100%", paddingRight: 0 }}
    >
      <ExpansionPanel
        elevation={0}
        onChange={(event, expanded) => {
          expanded
            ? dispatch(accusedOfficerPanelExpanded(caseOfficer.id))
            : dispatch(accusedOfficerPanelCollapsed(caseOfficer.id));
        }}
        style={{ backgroundColor: "white", width: "100%" }}
      >
        <ExpansionPanelSummary
          style={{
            padding: "0px 24px"
          }}
        >
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
            <OfficerNameDisplay
              displayLabel="Officer"
              fullName={caseOfficer.fullName}
              windowsUsername={caseOfficer.windowsUsername}
            />
            <OfficerInfoDisplay
              displayLabel="Rank/Title"
              value={caseOfficer.rank}
              testLabel="rank"
            />
            <OfficerNameDisplay
              displayLabel="Supervisor"
              fullName={caseOfficer.supervisorFullName}
              windowsUsername={caseOfficer.supervisorWindowsUsername}
            />
          </div>
        </ExpansionPanelSummary>
        <StyledExpansionPanelDetails>
          <OfficerInfoDisplay
            displayLabel="Employee Type"
            value={caseOfficer.employeeType}
            testLabel="employeeType"
          />
          <OfficerInfoDisplay
            displayLabel="District"
            value={caseOfficer.district}
            testLabel="district"
          />
          <OfficerInfoDisplay
            displayLabel="Bureau"
            value={caseOfficer.bureau}
            testLabel="bureau"
          />
        </StyledExpansionPanelDetails>
        <StyledExpansionPanelDetails>
          <OfficerInfoDisplay
            displayLabel="Status"
            value={caseOfficer.workStatus}
            testLabel="status"
          />
          <OfficerInfoDisplay
            displayLabel="Hire Date"
            value={formatDate(caseOfficer.hireDate)}
            testLabel="hireDate"
          />
          <OfficerInfoDisplay
            displayLabel="End of Employment"
            value={formatDate(caseOfficer.endDate)}
            testLabel="endDate"
          />
        </StyledExpansionPanelDetails>
        <StyledExpansionPanelDetails>
          <OfficerInfoDisplay
            displayLabel="Race"
            value={caseOfficer.race}
            testLabel="race"
          />
          <OfficerInfoDisplay
            displayLabel="Sex"
            value={caseOfficer.sex}
            testLabel="sex"
          />
          <DateOfBirthAgeInfoDisplay
            displayLabel="Date of Birth (Age on Incident Date)"
            testLabel="age"
            birthDate={formatDate(caseOfficer.dob)}
            age={officerAge}
            marginRight="10px"
          />
        </StyledExpansionPanelDetails>
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

export default connect()(OfficerPanel);
