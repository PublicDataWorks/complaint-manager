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
  ExpansionPanelSummary,
  Icon,
  IconButton
} from "@material-ui/core";
import formatDate from "../../../utilities/formatDate";
import formatPhoneNumber from "../../../utilities/formatPhoneNumber";
import AddressInfoDisplay from "../../../shared/components/AddressInfoDisplay";
import DateOfBirthAgeInfoDisplay from "../../../shared/components/DateOfBirthAgeInfoDisplay";

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
              <div style={{ width: "36px", marginRight: 16 }}>
                <IconButton
                  color="secondary"
                  className="chevron-right"
                  style={{ height: "36px", width: "36px" }}
                >
                  <Icon>unfold_more</Icon>
                </IconButton>
              </div>
              <div className={classes.detailsLastRow}>
                <CivilianInfoDisplay
                  displayLabel={"Civilian"}
                  value={civilian.fullName}
                  testLabel="complainantWitness"
                />
                <CivilianInfoDisplay
                  displayLabel="Gender Identity"
                  value={civilian.genderIdentity}
                  testLabel="genderIdentity"
                />
                <CivilianInfoDisplay
                  displayLabel="Race/Ethnicity"
                  value={civilian.raceEthnicity && civilian.raceEthnicity.name}
                  testLabel="raceEthnicity"
                />
              </div>
            </div>
          </ExpansionPanelSummary>
          <StyledExpansionPanelDetails>
            <DateOfBirthAgeInfoDisplay
              displayLabel="Date of Birth (Age on Incident Date)"
              testLabel="complainantBirthday"
              birthDate={birthDate}
              age={civilianAge}
              marginRight="10px"
            />
            <CivilianInfoDisplay
              displayLabel="Phone Number"
              value={phoneNumber}
              testLabel="complainantPhoneNumber"
            />
            <CivilianInfoDisplay
              displayLabel="Email"
              value={civilian.email}
              testLabel="complainantEmail"
            />
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <AddressInfoDisplay
              testLabel={"civilianAddress"}
              displayLabel={"Address"}
              address={civilian.address}
            />
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <CivilianInfoDisplay
              displayLabel="Additional Information"
              value={civilian.additionalInfo}
              testLabel="complainantAdditionalInfo"
            />
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
