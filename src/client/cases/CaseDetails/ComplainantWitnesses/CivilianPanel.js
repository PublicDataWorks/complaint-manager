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
  IconButton,
  Icon
} from "@material-ui/core";
import formatDate from "../../../utilities/formatDate";
import formatPhoneNumber from "../../../utilities/formatPhoneNumber";
import AddresesInfoDisplay from "../../../shared/components/AddressInfoDisplay";

const CivilianPanel = ({ civilian, dispatch }) => {
  const phoneNumber = formatPhoneNumber(civilian.phoneNumber);
  const birthDate = formatDate(civilian.birthDate);

  return (
    <div>
      <ExpansionPanel
        data-test="complainantWitnessesPanel"
        elevation={0}
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
            <CivilianInfoDisplay
              displayLabel={"Civilian"}
              value={civilian.fullName}
              testLabel="complainant"
            />
            <CivilianInfoDisplay
              displayLabel="Gender Identity"
              value={civilian.genderIdentity}
              testLabel="genderIdentity"
            />
            <CivilianInfoDisplay
              displayLabel="Race/Ethnicity"
              value={civilian.raceEthnicity}
              testLabel="raceEthnicity"
            />
            <div>
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
          </div>
        </ExpansionPanelSummary>
        <StyledExpansionPanelDetails>
          <CivilianInfoDisplay
            displayLabel="Date of Birth"
            value={birthDate}
            testLabel="complainantBirthday"
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
          <AddresesInfoDisplay
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
      <Divider />
    </div>
  );
};

export default CivilianPanel;
