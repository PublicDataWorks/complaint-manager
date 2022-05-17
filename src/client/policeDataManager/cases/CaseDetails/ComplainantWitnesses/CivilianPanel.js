import React from "react";
import { initialize } from "redux-form";
import {
  openCivilianDialog,
  openRemovePersonDialog
} from "../../../actionCreators/casesActionCreators";
import {
  CIVILIAN_FORM_NAME,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import editCivilian from "../../thunks/editCivilian";
import LinkButton from "../../../shared/components/LinkButton";
import StyledExpansionPanelDetails from "./StyledExpansionPanelDetails";
import CivilianInfoDisplay from "./CivilianInfoDisplay";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary
} from "@material-ui/core";
import formatDate from "../../../../../sharedUtilities/formatDate";
import formatPhoneNumber from "../../../../../sharedUtilities/formatPhoneNumber";
import AddressInfoDisplay from "../../../shared/components/AddressInfoDisplay";
import DateOfBirthAgeInfoDisplay from "../../../shared/components/DateOfBirthAgeInfoDisplay";
import ExpansionPanelIconButton from "../../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../../shared/components/StyledInfoDisplay";
import { connect } from "react-redux";

const CivilianPanel = ({
  civilian,
  civilianAge,
  dispatch,
  isArchived,
  classes,
  permissions
}) => {
  const phoneNumber = formatPhoneNumber(civilian.phoneNumber);
  const birthDate = formatDate(civilian.birthDate);
  let fullName;
  if (!civilian.fullName) {
    fullName = "Unknown";
  } else if (civilian.isAnonymous) {
    fullName = `(AC) ${civilian.fullName}`;
  } else {
    fullName = civilian.fullName;
  }

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
          data-testid="complainantWitnessesPanel"
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
                    value={fullName}
                    isAnonymous={civilian.isAnonymous}
                    testLabel="complainantWitness"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel="Gender Identity"
                    value={
                      civilian.genderIdentity && civilian.genderIdentity.name
                    }
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
              {permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? (
                <>
                  <LinkButton
                    data-testid="editComplainantLink"
                    onClick={event => {
                      event.stopPropagation();
                      dispatch(
                        initialize(CIVILIAN_FORM_NAME, {
                          ...civilian,
                          isUnknown: civilian.isAnonymous && !civilian.lastName,
                          isAnonymous:
                            civilian.isAnonymous && !!civilian.lastName
                        })
                      );
                      dispatch(
                        openCivilianDialog(
                          "Edit Civilian",
                          "Save",
                          editCivilian
                        )
                      );
                    }}
                  >
                    Edit
                  </LinkButton>
                  <LinkButton
                    data-testid="removeCivilianLink"
                    onClick={event => {
                      event.stopPropagation();
                      dispatch(openRemovePersonDialog(civilian, "civilians"));
                    }}
                  >
                    Remove
                  </LinkButton>
                </>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default connect(state => ({
  permissions: state?.users?.current?.userInfo?.permissions
}))(CivilianPanel);
