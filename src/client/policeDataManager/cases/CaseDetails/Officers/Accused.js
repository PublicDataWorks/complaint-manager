import React, { Fragment } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { CardContent, Divider, Typography } from "@material-ui/core";
import DetailsCard from "../../../shared/components/DetailsCard";
import ManageOfficerMenu from "./ManageOfficerMenu";
import WarningMessage from "../../../shared/components/WarningMessage";
import {
  ACCUSED,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import AddAccusedMenu from "./AddAccusedMenu";
import PersonOnCaseMenu from "../PersonOnCaseMenu";
import PersonOnCaseDisplay from "../PersonOnCase/PersonOnCaseDisplay";

const Accused = props => {
  const { dispatch, caseDetails, classes, permissions } = props;
  const {
    accusedOfficers,
    accusedInmates,
    accusedCivilians,
    id: caseId,
    isArchived,
    incidentDate
  } = caseDetails;
  const titleText = "Accused";
  const allAccused = (accusedCivilians || [])
    .concat(accusedOfficers || [])
    .concat(accusedInmates || []);

  const sortedAccused = _.orderBy(allAccused, [o => o.createdAt], ["asc"]);

  return (
    <DetailsCard
      data-testid="complainantWitnessesSection"
      title={titleText}
      maxWidth="850px"
    >
      <CardContent style={{ padding: "0" }}>
        {!sortedAccused || sortedAccused.length === 0 ? (
          renderNoOfficers(props)
        ) : (
          <PersonOnCaseDisplay
            civiliansAndOfficers={sortedAccused}
            classes={classes}
            dispatch={dispatch}
            emptyMessage=""
            incidentDate={incidentDate}
            isArchived={isArchived}
            permissions={permissions}
            OfficerButtonsComponent={ManageOfficerMenu}
          />
        )}
        {isArchived || !permissions?.includes(USER_PERMISSIONS.EDIT_CASE)
          ? null
          : renderAddAccused(dispatch, caseDetails, caseId, props)}
      </CardContent>
    </DetailsCard>
  );
};

const renderAddAccused = (dispatch, caseDetails, caseId, props) => {
  return (
    <Fragment>
      {props.allowAllTypesToBeAccused ? (
        <PersonOnCaseMenu
          dispatch={dispatch}
          caseDetails={caseDetails}
          civilianType={ACCUSED}
        />
      ) : (
        <AddAccusedMenu
          dispatch={dispatch}
          caseId={caseId}
          civilianType={ACCUSED}
        />
      )}
    </Fragment>
  );
};

const renderNoOfficers = props => {
  const noAccusedEmployeesMessage = props.allowAllTypesToBeAccused
    ? "No accused have been added"
    : "No accused employees have been added";

  return (
    <Fragment>
      <CardContent>
        {props.allowAccusedOfficersToBeBlankFeature ? (
          ""
        ) : (
          <WarningMessage>
            <Typography data-testid="noAccusedOfficersMessage" variant="body2">
              {noAccusedEmployeesMessage}
            </Typography>
          </WarningMessage>
        )}
      </CardContent>
      <Divider />
    </Fragment>
  );
};

const mapStateToProps = state => ({
  allowAccusedOfficersToBeBlankFeature:
    state.featureToggles.allowAccusedOfficersToBeBlankFeature,
  allowAllTypesToBeAccused: state.featureToggles.allowAllTypesToBeAccused,
  permissions: state?.users?.current?.userInfo?.permissions
});

export default connect(mapStateToProps)(Accused);
