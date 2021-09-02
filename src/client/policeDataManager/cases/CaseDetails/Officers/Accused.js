import React, { Fragment } from "react";
import { CardContent, Divider, Typography } from "@material-ui/core";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import AccusedOfficerPanel from "./OfficerPanel";
import UnknownOfficerPanel from "./UnknownOfficerPanel";
import ManageOfficerMenu from "./ManageOfficerMenu";
import WarningMessage from "../../../shared/components/WarningMessage";
import calculateAgeBasedOnIncidentDate from "../../../utilities/calculateAgeBasedOnIncidentDate";
import {
  ACCUSED,
  OFFICER_DETAILS_FORM_NAME
} from "../../../../../sharedUtilities/constants";
import AddAccusedMenu from "./AddAccusedMenu";
import LinkButton from "../../../shared/components/LinkButton";
import { initialize } from "redux-form";
import { push } from "connected-react-router";
import { addCaseEmployeeType } from "../../../actionCreators/officersActionCreators";

const {
  EMPLOYEE_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const Accused = props => {
  const {
    dispatch,
    accusedOfficers,
    incidentDate,
    caseId,
    isArchived,
    menuOpen,
    anchorEl
  } = props;
  const titleText = "Accused";

  return (
    <BaseCaseDetailsCard data-testid="officersSection" title={titleText}>
      <CardContent style={{ padding: "0" }}>
        {!accusedOfficers || accusedOfficers.length === 0
          ? renderNoOfficers()
          : accusedOfficers.map(caseOfficer =>
              caseOfficer.isUnknownOfficer ? (
                <UnknownOfficerPanel
                  key={caseOfficer.id}
                  caseOfficer={caseOfficer}
                >
                  {renderManageOfficerMenu(caseOfficer, isArchived)}
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
                  {renderManageOfficerMenu(caseOfficer, isArchived)}
                </AccusedOfficerPanel>
              )
            )}
        {isArchived
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
    </BaseCaseDetailsCard>
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

const renderManageOfficerMenu = (caseOfficer, isArchived) => (
  <Fragment>
    {isArchived ? null : <ManageOfficerMenu caseOfficer={caseOfficer} />}
  </Fragment>
);

export default Accused;
