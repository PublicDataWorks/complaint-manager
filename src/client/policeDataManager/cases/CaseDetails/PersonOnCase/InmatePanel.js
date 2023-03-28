import React, { useState } from "react";
import axios from "axios";
import { Divider, Accordion, AccordionSummary } from "@material-ui/core";
import OfficerInfoDisplay from "./Officers/OfficerInfoDisplay";
import StyledExpansionPanelDetails from "./StyledExpansionPanelDetails";
import formatDate from "../../../../../sharedUtilities/formatDate";
import DateOfBirthAgeInfoDisplay from "../../../shared/components/DateOfBirthAgeInfoDisplay";
import ExpansionPanelIconButton from "../../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../../shared/components/StyledInfoDisplay";
import LinkButton from "../../../shared/components/LinkButton";
import { connect } from "react-redux";
import {
  CONFIGS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import { removePersonSuccess } from "../../../actionCreators/casesActionCreators";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

const InmatePanel = ({ caseInmate, dispatch, pd, permissions, isArchived }) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const getCaseInmateName = () => {
    let fullName;
    if (caseInmate.fullName) {
      fullName = caseInmate.fullName;
    } else {
      fullName = caseInmate.inmate.fullName;
    }

    if (caseInmate.isAnonymous) {
      return `(ANON) ${fullName}`;
    } else {
      return fullName;
    }
  };

  return (
    <div>
      <div
        data-testid="inmate-panel"
        style={{ display: "flex", width: "100%", paddingRight: 0 }}
      >
        <Accordion
          elevation={0}
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
                  value={getCaseInmateName()}
                />
              </StyledInfoDisplay>
              <StyledInfoDisplay>
                <OfficerInfoDisplay
                  displayLabel="ID"
                  value={
                    caseInmate?.inmate?.inmateId ?? caseInmate?.notFoundInmateId
                  }
                />
              </StyledInfoDisplay>
              <StyledInfoDisplay>
                <OfficerInfoDisplay
                  displayLabel="Facility"
                  value={caseInmate?.inmate?.facility ?? caseInmate?.facility}
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
                value={caseInmate?.inmate?.region}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Status"
                value={caseInmate?.inmate?.status}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Custody Status"
                value={caseInmate?.inmate?.custodyStatus}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Race"
                value={caseInmate?.inmate?.race}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Gender"
                value={caseInmate?.inmate?.gender}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Primary Ethnicity"
                value={caseInmate?.inmate?.primaryEthnicity}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <DateOfBirthAgeInfoDisplay
                displayLabel="Date of Birth"
                testLabel="age"
                birthDate={formatDate(caseInmate?.inmate?.dateOfBirth)}
                age={caseInmate?.inmate?.age}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Country of Birth"
                value={caseInmate?.inmate?.countryOfBirth}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Language"
                value={caseInmate?.inmate?.language}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Booking Start Date"
                value={formatDate(caseInmate?.inmate?.bookingStartDate)}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Booking End Date"
                value={formatDate(caseInmate?.inmate?.bookingEndDate)}
              />
            </StyledInfoDisplay>
            <StyledInfoDisplay>
              <OfficerInfoDisplay
                displayLabel="Tentative Release Date"
                value={formatDate(caseInmate?.inmate?.tentativeReleaseDate)}
              />
            </StyledInfoDisplay>
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <OfficerInfoDisplay
              displayLabel="Notes"
              value={caseInmate?.notes}
            />
          </StyledExpansionPanelDetails>
        </Accordion>
        {isArchived ? null : (
          <div style={{ margin: "12px 24px" }}>
            {permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? (
              <>
                <LinkButton
                  data-testid="removePersonInCustodyLink"
                  onClick={event => {
                    event.stopPropagation();
                    setRemoveDialogOpen(true);
                  }}
                >
                  Remove
                </LinkButton>
                {removeDialogOpen ? (
                  <ConfirmationDialog
                    confirmText="Remove"
                    onConfirm={() => {
                      axios
                        .delete(
                          `api/cases/${caseInmate.caseId}/inmates/${caseInmate.id}`
                        )
                        .then(result => {
                          dispatch(
                            snackbarSuccess(
                              "Person in Custody was successfully removed"
                            )
                          );
                          setRemoveDialogOpen(false);
                          dispatch(removePersonSuccess(result.data));
                        });
                    }}
                    onCancel={() => setRemoveDialogOpen(false)}
                    open={removeDialogOpen}
                    title="Remove Person in Custody"
                  >
                    This action will remove{" "}
                    <strong>
                      {caseInmate.inmate?.fullName ?? caseInmate.fullName}
                    </strong>{" "}
                    and all information associated to this person from the case.
                    Are you sure you want to continue?
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
      <Divider />
    </div>
  );
};

export default connect(state => ({
  pd: state.configs[CONFIGS.PD],
  permissions: state?.users?.current?.userInfo?.permissions
}))(InmatePanel);
