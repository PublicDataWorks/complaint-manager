import React from "react";
import { initialize } from "redux-form";
import {
  openCivilianDialog,
  openRemovePersonDialog
} from "../../../actionCreators/casesActionCreators";
import { CIVILIAN_FORM_NAME } from "../../../../sharedUtilities/constants";
import editCivilian from "../../thunks/editCivilian";
import LinkButton from "../../../shared/components/LinkButton";
import StyledExpansionPanelDetails from "./StyledExpansionPanelDetails";
import CivilianInfoDisplay from "./CivilianInfoDisplay";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary
} from "@material-ui/core";
import formatDate from "../../../utilities/formatDate";
import formatPhoneNumber from "../../../utilities/formatPhoneNumber";
import AddressInfoDisplay from "../../../shared/components/AddressInfoDisplay";
import DateOfBirthAgeInfoDisplay from "../../../shared/components/DateOfBirthAgeInfoDisplay";
import ExpansionPanelIconButton from "../../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../../shared/components/StyledInfoDisplay";

const CivilianPanel = ({
  civilian,
  civilianAge,
  dispatch,
  isArchived,
  classes
}) => {
  const phoneNumber = formatPhoneNumber(civilian.phoneNumber);
  const birthDate = formatDate(civilian.birthDate);

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          paddingRight: 0
        }}
      >
        <ExpansionPanel
          data-test="complainantWitnessesPanel"
          elevation={0}
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
              <ExpansionPanelIconButton />
              <div className={classes.detailsLastRow}>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel={"Civilian"}
                    value={civilian.fullName}
                    testLabel="complainantWitness"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Gender Identity"
                    value={civilian.genderIdentity}
                    testLabel="genderIdentity"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Race/Ethnicity"
                    value={
                      civilian.raceEthnicity && civilian.raceEthnicity.name
                    }
                    testLabel="raceEthnicity"
                  />
                </StyledInfoDisplay>
              </div>
            </div>
          </ExpansionPanelSummary>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <DateOfBirthAgeInfoDisplay
                displayLabel="Date of Birth (Age on Incident Date)"
                testLabel="complainantBirthday"
                birthDate={birthDate}
                age={civilianAge}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <CivilianInfoDisplay
                displayLabel="Phone Number"
                value={phoneNumber}
                testLabel="complainantPhoneNumber"
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <CivilianInfoDisplay
                displayLabel="Email"
                value={civilian.email}
                testLabel="complainantEmail"
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <AddressInfoDisplay
                testLabel={"civilianAddress"}
                displayLabel={"Address"}
                address={civilian.address}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <CivilianInfoDisplay
                displayLabel="Additional Information"
                value={civilian.additionalInfo}
                testLabel="complainantAdditionalInfo"
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
        </ExpansionPanel>
        <div style={{ margin: "12px 24px" }}>
          {isArchived ? null : (
            <div style={{ display: "flex" }}>
              <LinkButton
                data-test="editComplainantLink"
                onClick={event => {
                  event.stopPropagation();
                  dispatch(initialize(CIVILIAN_FORM_NAME, civilian));
                  dispatch(
                    openCivilianDialog("Edit Civilian", "Save", editCivilian)
                  );
                }}
              >
                Edit
              </LinkButton>
              <LinkButton
                data-test="removeCivilianLink"
                onClick={event => {
                  event.stopPropagation();
                  dispatch(openRemovePersonDialog(civilian, "civilians"));
                }}
              >
                Remove
              </LinkButton>
            </div>
          )}
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default CivilianPanel;
