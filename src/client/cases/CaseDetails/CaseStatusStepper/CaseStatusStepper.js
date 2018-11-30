import React, { Fragment } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { CASE_STATUS_MAP } from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import UpdateCaseStatusDialog from "../UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import DownloadFinalLetterButton from "../DownloadFinalLetterButton/DownloadFinalLetterButton";
import EditLetterButton from "../EditLetterButton/EditLetterButton";
import StatusButton from "../StatusButton/StatusButton";

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
  const getActiveStep = () => {
    return CASE_STATUS_MAP[status] === 5
      ? 6 // marks closed status with a checkmark
      : CASE_STATUS_MAP[status];
  };

  const renderButtons = () => {
    return (
      <div
        style={{
          marginRight: "5%",
          marginLeft: "5%",
          maxWidth: "850px",
          paddingBottom: "24px",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>
          <DownloadFinalLetterButton />
        </div>
        <div>
          <EditLetterButton status={status} caseId={caseId} />
          <StatusButton />
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Stepper
        data-test="statusStepper"
        activeStep={getActiveStep()}
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
