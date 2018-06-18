import React from "react";
import { Step, Stepper, StepLabel } from "@material-ui/core";
import {CASE_STATUS} from "../../../../sharedUtilities/constants";
import {connect} from "react-redux"

//TODO replace magic strings with constants
const caseStatusMap = {
  [CASE_STATUS.INITIAL] : 0,
  [CASE_STATUS.ACTIVE] : 1,
  [CASE_STATUS.READY_FOR_REVIEW] : 2,
  [CASE_STATUS.FORWARDED_TO_AGENCY] : 3,
  [CASE_STATUS.CLOSED] : 4,
};

const generateSteps = map => {
  return Object.keys(map).map(key => {
    return (
      <Step key={key}>
        <StepLabel>{key}</StepLabel>
      </Step>
    );
  });
};

const CaseStatusStepper = ({status}) => {
  return (
    <Stepper data-test="statusStepper" activeStep={caseStatusMap[status]} alternativeLabel>
      {generateSteps(caseStatusMap)}
    </Stepper>
  );
};

const mapStateToProps = state => ({
  status: state.currentCase.details.status
})

export default connect(mapStateToProps)(CaseStatusStepper);
