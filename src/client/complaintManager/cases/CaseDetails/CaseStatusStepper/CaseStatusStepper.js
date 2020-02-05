import React, { Fragment } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { CASE_STATUS_MAP } from "../../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import UpdateCaseStatusDialog from "../UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import DownloadFinalLetterButton from "../DownloadFinalLetterButton/DownloadFinalLetterButton";
import EditLetterButton from "../EditLetterButton/EditLetterButton";
import StatusButton from "../StatusButton/StatusButton";
import getActiveStep from "./getActiveStep";

const generateSteps = map => {
  return Object.keys(map).map(key => {
    return (
      <Step key={key}>
        <StepLabel>{key}</StepLabel>
      </Step>
    );
  });
};

const CaseStatusStepper = ({ caseId, status, isArchived }) => {
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
          {isArchived ? null : (
            <EditLetterButton status={status} caseId={caseId} />
          )}
          <StatusButton />
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Stepper
        data-testid="statusStepper"
        activeStep={getActiveStep(CASE_STATUS_MAP, status)}
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
  isArchived: state.currentCase.details.isArchived
});

export default connect(mapStateToProps)(CaseStatusStepper);
