import React, { Fragment } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { LETTER_PROGRESS_MAP } from "../../../sharedUtilities/constants";
import { connect } from "react-redux";

const generateSteps = map => {
  return Object.keys(map).map(key => {
    return (
      <Step key={key}>
        <StepLabel>{key}</StepLabel>
      </Step>
    );
  });
};

const LetterProgressStepper = ({ caseId, status }) => {
  return (
    <Fragment>
      <Stepper
        data-test="statusStepper"
        activeStep={LETTER_PROGRESS_MAP[status]}
        alternativeLabel
        style={{ marginLeft: "5%", maxWidth: "850px", padding: "24px 0px" }}
      >
        {generateSteps(LETTER_PROGRESS_MAP)}
      </Stepper>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  status: state.currentCase.details.status,
  nextStatus: state.currentCase.details.nextStatus,
  userInfo: state.users.current.userInfo,
  featureToggles: state.featureToggles
});

export default connect(mapStateToProps)(LetterProgressStepper);
