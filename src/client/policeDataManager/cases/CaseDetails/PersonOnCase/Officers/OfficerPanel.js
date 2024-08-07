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
import formatDate from "../../../../../../sharedUtilities/formatDate";
import OfficerNameDisplay from "./OfficerNameDisplay";
import OfficerAllegationsDisplay from "./OfficerAllegationsDisplay";
import styles from "../../../../../common/globalStyling/styles";
import {
  ACCUSED,
  CONFIGS,
  OFFICER_TITLE
} from "../../../../../../sharedUtilities/constants";
import {
  accusedOfficerPanelCollapsed,
  accusedOfficerPanelExpanded
} from "../../../../actionCreators/accusedOfficerPanelsActionCreators";
import DateOfBirthAgeInfoDisplay from "../../../../shared/components/DateOfBirthAgeInfoDisplay";
import ExpansionPanelIconButton from "../../../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../../../shared/components/StyledInfoDisplay";
import formatPhoneNumber from "../../../../../../sharedUtilities/formatPhoneNumber";

const OfficerPanel = ({ dispatch, caseOfficer, officerAge, children, pd }) => {
  const isCivilianWithinPd = caseOfficer.caseEmployeeType.includes("Civilian");
  const caseEmployeeTitle = isCivilianWithinPd
    ? `Civilian (${pd})`
    : OFFICER_TITLE;
  const fullNameIsAnonymous = caseOfficer.isAnonymous
    ? `(ANON) ${caseOfficer.fullName}`
    : caseOfficer.fullName;

  const knownEmployeePanelDataTest = isCivilianWithinPd
    ? "knownCivilian(PD)Panel"
    : "knownOfficerPanel";

  const phoneNumber = formatPhoneNumber(caseOfficer.phoneNumber);

  return (
    <div>
      <div
        data-testid={knownEmployeePanelDataTest}
        style={{ display: "flex", width: "100%", paddingRight: 0 }}
      >
        <Accordion
          elevation={0}
          onChange={(event, expanded) => {
            expanded
              ? dispatch(accusedOfficerPanelExpanded(caseOfficer.id))
              : dispatch(accusedOfficerPanelCollapsed(caseOfficer.id));
          }}
          style={{ backgroundColor: "white", width: "100%" }}
        >
          <AccordionSummary
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
              <ExpansionPanelIconButton />
              <StyledInfoDisplay>
                <OfficerNameDisplay
                  displayLabel={caseEmployeeTitle}
                  fullName={fullNameIsAnonymous}
                  employeeId={caseOfficer.employeeId}
                />
              </StyledInfoDisplay>
              <StyledInfoDisplay>
                <OfficerInfoDisplay
                  displayLabel="Rank/Title"
                  value={caseOfficer.rank}
                  testLabel="rank"
                />
              </StyledInfoDisplay>
              <StyledInfoDisplay>
                <OfficerNameDisplay
                  displayLabel="Supervisor"
                  fullName={caseOfficer.supervisorFullName}
                  employeeId={caseOfficer.supervisorEmployeeId}
                />
              </StyledInfoDisplay>
            </div>
          </AccordionSummary>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Employee Type"
                value={caseOfficer.employeeType}
                testLabel="employeeType"
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="District/Assignment"
                value={caseOfficer.district}
                testLabel="district"
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Bureau"
                value={caseOfficer.bureau}
                testLabel="bureau"
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Status"
                value={caseOfficer.workStatus}
                testLabel="status"
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Hire Date"
                value={formatDate(caseOfficer.hireDate)}
                testLabel="hireDate"
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="End of Employment"
                value={formatDate(caseOfficer.endDate)}
                testLabel="endDate"
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Race"
                value={caseOfficer.race}
                testLabel="race"
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Sex"
                value={caseOfficer.sex}
                testLabel="sex"
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <DateOfBirthAgeInfoDisplay
                displayLabel="Date of Birth (Age on Incident Date)"
                testLabel="age"
                birthDate={formatDate(caseOfficer.dob)}
                age={officerAge}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
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

export default connect(state => ({
  pd: state.configs[CONFIGS.PD]
}))(OfficerPanel);
