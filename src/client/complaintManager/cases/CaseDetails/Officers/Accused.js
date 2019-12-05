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
  EMPLOYEE_TYPE,
  OFFICER_DETAILS_FORM_NAME
} from "../../../../../sharedUtilities/constants";
import AddAccusedMenu from "./AddAccusedMenu";
import LinkButton from "../../../shared/components/LinkButton";
import { initialize } from "redux-form";
import { push } from "connected-react-router";
import { addCaseEmployeeType } from "../../../actionCreators/officersActionCreators";

const Accused = props => {
  const {
    dispatch,
    accusedOfficers,
    incidentDate,
    caseId,
    isArchived,
    menuOpen,
    anchorEl,
    cnComplaintTypeFeature
  } = props;
  const titleText = cnComplaintTypeFeature ? "Accused" : "Accused Officers";

  return (
    <BaseCaseDetailsCard data-test="officersSection" title={titleText}>
      <CardContent style={{ padding: "0" }}>
        {!accusedOfficers || accusedOfficers.length === 0
          ? renderNoOfficers(cnComplaintTypeFeature)
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
              ACCUSED,
              cnComplaintTypeFeature
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
  caseId,
  civilianType,
  cnComplaintTypeFeature
) => {
  return (
    <Fragment>
      {cnComplaintTypeFeature ? (
        <AddAccusedMenu
          menuOpen={menuOpen}
          handleMenuClose={handleMenuClose}
          handleMenuOpen={handleMenuOpen}
          anchorEl={anchorEl}
          dispatch={dispatch}
          caseId={caseId}
          civilianType={ACCUSED}
          cnComplaintTypeFeature={cnComplaintTypeFeature}
        />
      ) : (
        <LinkButton
          style={{
            marginLeft: "8px",
            marginTop: "8px",
            marginBottom: "8px"
          }}
          onClick={() => {
            dispatch(
              initialize(OFFICER_DETAILS_FORM_NAME, {
                roleOnCase: ACCUSED
              })
            );
            dispatch(addCaseEmployeeType(EMPLOYEE_TYPE.OFFICER));
            dispatch(push(`/cases/${caseId}/officers/search`));
          }}
          data-test="addAccusedOfficerButton"
        >
          + Add Officer
        </LinkButton>
      )}
    </Fragment>
  );
};

const renderNoOfficers = cnComplaintTypeFeature => {
  const noAccusedEmployeesMessage = cnComplaintTypeFeature
    ? "No accused employees have been added"
    : "No accused officers have been added";

  return (
    <Fragment>
      <CardContent>
        <WarningMessage>
          <Typography data-test="noAccusedOfficersMessage" variant="body2">
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
