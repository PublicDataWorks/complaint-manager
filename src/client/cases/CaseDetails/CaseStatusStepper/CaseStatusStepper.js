import React, { Fragment } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import {
  CASE_STATUS,
  CASE_STATUS_MAP,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import UpdateCaseStatusDialog from "../UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import { Link } from "react-router-dom";

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
    status === CASE_STATUS.LETTER_IN_PROGRESS ||
    (userInfo &&
      userInfo.permissions.includes(USER_PERMISSIONS.CAN_REVIEW_CASE))
  );
}

const CaseStatusStepper = ({
  caseId,
  status,
  userInfo,
  nextStatus,
  dispatch
}) => {
  const openUpdateCaseStatusDialog = () => {
    let redirectUrl;
    if (nextStatus === CASE_STATUS.LETTER_IN_PROGRESS) {
      redirectUrl = `/cases/${caseId}/letter/review`;
    }
    dispatch(openCaseStatusUpdateDialog(redirectUrl));
  };

  const renderTransitionButton = () => {
    return (
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
        {status === CASE_STATUS.LETTER_IN_PROGRESS ? (
          <PrimaryButton
            data-test={status === "editLetterButton"}
            to={`/cases/${caseId}/letter/review`}
            component={Link}
          >
            Resume Letter
          </PrimaryButton>
        ) : (
          <PrimaryButton
            data-test="update-status-button"
            onClick={openUpdateCaseStatusDialog}
          >
            {status === CASE_STATUS.ACTIVE
              ? `Begin Letter`
              : `Mark as ${nextStatus}`}
          </PrimaryButton>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      <Stepper
        data-test="statusStepper"
        activeStep={CASE_STATUS_MAP[status]}
        alternativeLabel
        style={{ marginLeft: "5%", maxWidth: "850px", padding: "24px 0px" }}
      >
        {generateSteps(CASE_STATUS_MAP)}
      </Stepper>
      {shouldRenderStatusTransitionButton(status, userInfo)
        ? renderTransitionButton()
        : null}
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

export default connect(mapStateToProps)(CaseStatusStepper);
