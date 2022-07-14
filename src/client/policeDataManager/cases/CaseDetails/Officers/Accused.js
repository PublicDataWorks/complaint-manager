import React, { Fragment } from "react";
import { CardContent, Divider, Typography } from "@material-ui/core";
import DetailsCard from "../../../shared/components/DetailsCard";
import AccusedOfficerPanel from "./OfficerPanel";
import UnknownOfficerPanel from "./UnknownOfficerPanel";
import ManageOfficerMenu from "./ManageOfficerMenu";
import WarningMessage from "../../../shared/components/WarningMessage";
import calculateAgeBasedOnIncidentDate from "../../../utilities/calculateAgeBasedOnIncidentDate";
import {
  ACCUSED,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import AddAccusedMenu from "./AddAccusedMenu";
import { connect } from "react-redux";

const Accused = props => {
  const {
    dispatch,
    accusedOfficers,
    incidentDate,
    caseId,
    isArchived,
    menuOpen,
    anchorEl,
    permissions
  } = props;
  const titleText = "Accused";

  return (
    <DetailsCard
      data-testid="officersSection"
      title={titleText}
      maxWidth="850px"
    >
      <CardContent style={{ padding: "0" }}>
        {!accusedOfficers || accusedOfficers.length === 0
          ? renderNoOfficers()
          : accusedOfficers.map(caseOfficer =>
              caseOfficer.isUnknownOfficer ? (
                <UnknownOfficerPanel
                  key={caseOfficer.id}
                  caseOfficer={caseOfficer}
                >
                  {isArchived ||
                  !permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? null : (
                    <ManageOfficerMenu caseOfficer={caseOfficer} />
                  )}
                </UnknownOfficerPanel>
              ) : (
                <AccusedOfficerPanel
                  key={caseOfficer.id}
                  caseOfficer={caseOfficer}
                  officerAge={calculateAgeBasedOnIncidentDate(
                    caseOfficer,
                    incidentDate
                  )}
                >
                  {isArchived ||
                  !permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? null : (
                    <ManageOfficerMenu caseOfficer={caseOfficer} />
                  )}
                </AccusedOfficerPanel>
              )
            )}
        {isArchived || !permissions?.includes(USER_PERMISSIONS.EDIT_CASE)
          ? null
          : renderAddAccused(
              menuOpen,
              props.handleMenuClose,
              props.handleMenuOpen,
              anchorEl,
              dispatch,
              caseId,
              ACCUSED
            )}
      </CardContent>
    </DetailsCard>
  );
};

const renderAddAccused = (
  menuOpen,
  handleMenuClose,
  handleMenuOpen,
  anchorEl,
  dispatch,
  caseId
) => {
  return (
    <Fragment>
      <AddAccusedMenu
        menuOpen={menuOpen}
        handleMenuClose={handleMenuClose}
        handleMenuOpen={handleMenuOpen}
        anchorEl={anchorEl}
        dispatch={dispatch}
        caseId={caseId}
        civilianType={ACCUSED}
      />
    </Fragment>
  );
};

const renderNoOfficers = () => {
  const noAccusedEmployeesMessage = "No accused employees have been added";

  return (
    <Fragment>
      <CardContent>
        <WarningMessage>
          <Typography data-testid="noAccusedOfficersMessage" variant="body2">
            {noAccusedEmployeesMessage}
          </Typography>
        </WarningMessage>
      </CardContent>
      <Divider />
    </Fragment>
  );
};

export default connect(state => ({
  permissions: state?.users?.current?.userInfo?.permissions
}))(Accused);
