import React from "react";
import { Divider, Accordion, AccordionSummary } from "@material-ui/core";
import OfficerInfoDisplay from "../Officers/OfficerInfoDisplay";
import StyledExpansionPanelDetails from "./StyledExpansionPanelDetails";
import formatDate from "../../../../../sharedUtilities/formatDate";
import DateOfBirthAgeInfoDisplay from "../../../shared/components/DateOfBirthAgeInfoDisplay";
import ExpansionPanelIconButton from "../../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../../shared/components/StyledInfoDisplay";

const InmatePanel = ({ caseInmate, children }) => {
  return (
    <div>
      <div
        data-testid="inmate-panel"
        style={{ display: "flex", width: "100%", paddingRight: 0 }}
      >
        <Accordion
          elevation={0}
          // onChange={(event, expanded) => {
          //   expanded
          //     ? dispatch(accusedInmatePanelExpanded(caseInmate.id))
          //     : dispatch(accusedInmatePanelCollapsed(caseInmate.id));
          // }}
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
                <OfficerInfoDisplay
                  displayLabel="Person in Custody"
                  value={caseInmate?.inmate?.fullName}
                />
              </StyledInfoDisplay>
              <StyledInfoDisplay>
                <OfficerInfoDisplay
                  displayLabel="ID"
                  value={caseInmate?.inmate?.inmateId}
                />
              </StyledInfoDisplay>
              <StyledInfoDisplay>
                <OfficerInfoDisplay
                  displayLabel="Facility"
                  value={caseInmate?.inmate?.facility}
                />
              </StyledInfoDisplay>
            </div>
          </AccordionSummary>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Module"
                value={caseInmate?.inmate?.locationSub1}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Cell"
                value={caseInmate?.inmate?.locationSub2}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Bed"
                value={caseInmate?.inmate?.locationSub3}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Region"
                value={caseInmate.inmate.region}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Status"
                value={caseInmate.inmate.status}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Custody Status"
                value={caseInmate.inmate.custodyStatus}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Race"
                value={caseInmate.inmate.race}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Gender"
                value={caseInmate.inmate.gender}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Primary Ethnicity"
                value={caseInmate.inmate.primaryEthnicity}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <DateOfBirthAgeInfoDisplay
                displayLabel="Date of Birth"
                testLabel="age"
                birthDate={formatDate(caseInmate.inmate.dateOfBirth)}
                age={caseInmate.inmate.age}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Country of Birth"
                value={caseInmate.inmate.countryOfBirth}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Language"
                value={caseInmate.inmate.language}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Booking Start Date"
                value={formatDate(caseInmate.inmate.bookingStartDate)}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Booking End Date"
                value={formatDate(caseInmate.inmate.bookingEndDate)}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Tentative Release Date"
                value={formatDate(caseInmate.inmate.tentativeReleaseDate)}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
        </Accordion>
        <div style={{ margin: "12px 24px" }}>{children || ""}</div>
      </div>
      <Divider />
    </div>
  );
};

export default InmatePanel;
