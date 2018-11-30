import React, { Fragment } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import {
  CASE_STATUS,
  TOGGLE_CASE_STATUS_MAP,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import UpdateCaseStatusDialog from "../UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";

const generateSteps = map => {
  return Object.keys(map).map(key => {
    return (
      <Step key={key}>
        <StepLabel>{key}</StepLabel>
      </Step>
    );
  });
};

function shouldRenderStatusTransitionButton(status, userInfo) {
  if (status === CASE_STATUS.INITIAL || status === CASE_STATUS.CLOSED)
    return false;

  return (
    status === CASE_STATUS.ACTIVE ||
    (userInfo &&
      userInfo.permissions.includes(USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES))
  );
}

const OldCaseStatusStepper = ({
  caseId,
  status,
  userInfo,
  nextStatus,
  dispatch
}) => {
  if (
    status === CASE_STATUS.LETTER_IN_PROGRESS ||
    status === CASE_STATUS.ACTIVE
  ) {
    status = CASE_STATUS.ACTIVE;
    nextStatus = CASE_STATUS.READY_FOR_REVIEW;
  }

  const openUpdateCaseStatusDialog = () => {
    dispatch(openCaseStatusUpdateDialog());
  };

  const getActiveStep = () => {
    return TOGGLE_CASE_STATUS_MAP[status] === 4
      ? 5
      : TOGGLE_CASE_STATUS_MAP[status];
  };

  return (
    <Fragment>
      <Stepper
        data-test="statusStepper"
        activeStep={getActiveStep()}
        alternativeLabel
        style={{ marginLeft: "5%", maxWidth: "850px", padding: "24px 0px" }}
      >
        {generateSteps(TOGGLE_CASE_STATUS_MAP)}
      </Stepper>
      {shouldRenderStatusTransitionButton(status, userInfo) ? (
        <div
          style={{
            marginLeft: "5%",
            marginRight: "5%",
            maxWidth: "850px",
            paddingBottom: "24px",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <PrimaryButton
            data-test="update-status-button"
            onClick={openUpdateCaseStatusDialog}
          >
            {`Mark as ${nextStatus}`}
          </PrimaryButton>
        </div>
      ) : null}
      <UpdateCaseStatusDialog />
    </Fragment>
  );
};

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  status: state.currentCase.details.status,
  nextStatus: state.currentCase.details.nextStatus,
  userInfo: state.users.current.userInfo
});

export default connect(mapStateToProps)(OldCaseStatusStepper);
