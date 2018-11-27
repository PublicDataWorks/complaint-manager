import React, { Fragment } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import {
  CASE_STATUS,
  CASE_STATUS_MAP,
  CASE_STATUSES_ALLOWED_TO_EDIT_LETTER,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import UpdateCaseStatusDialog from "../UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import { Link } from "react-router-dom";
import LinkButton from "../../../shared/components/LinkButton";

const generateSteps = map => {
  return Object.keys(map).map(key => {
    return (
      <Step key={key}>
        <StepLabel>{key}</StepLabel>
      </Step>
    );
  });
};

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

  const currentStatusDoesNotNeedButton = () => {
    return [CASE_STATUS.INITIAL, CASE_STATUS.CLOSED].includes(status);
  };

  const userDoesNotHavePermissionToChangeStatus = () => {
    return (
      [CASE_STATUS.READY_FOR_REVIEW, CASE_STATUS.FORWARDED_TO_AGENCY].includes(
        status
      ) &&
      (!userInfo ||
        !userInfo.permissions.includes(USER_PERMISSIONS.CAN_REVIEW_CASE))
    );
  };

  const renderStatusButton = () => {
    if (
      currentStatusDoesNotNeedButton() ||
      userDoesNotHavePermissionToChangeStatus()
    ) {
      return;
    }

    if (status === CASE_STATUS.READY_FOR_REVIEW) {
      return (
        <PrimaryButton
          data-test={"review-and-approve-letter-button"}
          to={`/cases/${caseId}/letter/review-and-approve`}
          component={Link}
          style={{ marginLeft: "16px" }}
        >
          Review and Approve Letter
        </PrimaryButton>
      );
    } else {
      return (
        <PrimaryButton
          data-test="update-status-button"
          onClick={openUpdateCaseStatusDialog}
          style={{ marginLeft: "16px" }}
        >
          {status === CASE_STATUS.ACTIVE
            ? `Begin Letter`
            : `Mark as ${nextStatus}`}
        </PrimaryButton>
      );
    }
  };

  const renderEditLetterButton = () => {
    if (CASE_STATUSES_ALLOWED_TO_EDIT_LETTER.includes(status)) {
      return (
        <LinkButton
          data-test={"edit-letter-button"}
          to={`/cases/${caseId}/letter/review`}
          component={Link}
        >
          {status === CASE_STATUS.LETTER_IN_PROGRESS
            ? "Resume Letter"
            : "Edit Letter"}
        </LinkButton>
      );
    }
  };

  const renderButtons = () => {
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
        {renderEditLetterButton()}
        {renderStatusButton()}
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
      {renderButtons()}
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
