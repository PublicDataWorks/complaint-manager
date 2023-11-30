import React, { useState } from "react";
import { initialize } from "redux-form";
import {
  openCivilianDialog,
  removePersonSuccess
} from "../../../actionCreators/casesActionCreators";
import {
  CIVILIAN_FORM_NAME,
  CONFIGS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import editCivilian from "../../thunks/editCivilian";
import LinkButton from "../../../shared/components/LinkButton";
import StyledExpansionPanelDetails from "./StyledExpansionPanelDetails";
import CivilianInfoDisplay from "./CivilianInfoDisplay";
import { Divider, Accordion, AccordionSummary } from "@material-ui/core";
import formatDate from "../../../../../sharedUtilities/formatDate";
import formatPhoneNumber from "../../../../../sharedUtilities/formatPhoneNumber";
import AddressInfoDisplay from "../../../shared/components/AddressInfoDisplay";
import DateOfBirthAgeInfoDisplay from "../../../shared/components/DateOfBirthAgeInfoDisplay";
import ExpansionPanelIconButton from "../../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../../shared/components/StyledInfoDisplay";
import { connect } from "react-redux";
import { getSelectedPersonType } from "../../../globalData/person-type-selectors";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import axios from "axios";

const CivilianPanel = ({
  civilian,
  civilianAge,
  classes,
  dispatch,
  isArchived,
  pd,
  permissions,
  personType
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const phoneNumber = formatPhoneNumber(civilian.phoneNumber);
  const birthDate = formatDate(civilian.birthDate);
  let fullName;
  if (!civilian.fullName) {
    fullName = "Unknown";
  } else if (civilian.isAnonymous) {
    fullName = `(ANON) ${civilian.fullName}`;
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
        <Accordion
          data-testid="personOnCaseesPanel"
          elevation={0}
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
              <div className={classes.detailsLastRow}>
                <StyledInfoDisplay>
                  <CivilianInfoDisplay
                    displayLabel={personType?.description || "Civilian"}
                    value={fullName}
                    isAnonymous={civilian.isAnonymous}
                    testLabel="personOnCase"
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
          </AccordionSummary>
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
            {civilian.personSubType && (
              <StyledInfoDisplay>
                <CivilianInfoDisplay
                  displayLabel="Role"
                  value={civilian.personSubType}
                  testLabel="complainantRole"
                />
              </StyledInfoDisplay>
            )}
          </StyledExpansionPanelDetails>
        </Accordion>
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
                            civilian.isAnonymous && !!civilian.lastName,
                          raceEthnicity: undefined,
                          genderIdentity: undefined,
                          fullName: undefined
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
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Remove
                  </LinkButton>
                  {deleteDialogOpen ? (
                    <ConfirmationDialog
                      confirmText="Remove"
                      onConfirm={() => {
                        axios
                          .delete(
                            `api/cases/${civilian.caseId}/civilians/${civilian.id}`
                          )
                          .then(result => {
                            dispatch(
                              snackbarSuccess(
                                "Civilian was successfully removed"
                              )
                            );
                            setDeleteDialogOpen(false);
                            dispatch(removePersonSuccess(result.data));
                          });
                      }}
                      onCancel={() => setDeleteDialogOpen(false)}
                      open={deleteDialogOpen}
                      title="Remove Civilian"
                    >
                      This action will remove{" "}
                      <strong>{civilian.fullName}</strong> and all information
                      associated to this person from the case. Are you sure you
                      want to continue?
                    </ConfirmationDialog>
                  ) : (
                    ""
                  )}
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

export default connect((state, props) => ({
  pd: state.configs[CONFIGS.PD],
  permissions: state?.users?.current?.userInfo?.permissions,
  personType: getSelectedPersonType(state, props.civilian.personType)
}))(CivilianPanel);
