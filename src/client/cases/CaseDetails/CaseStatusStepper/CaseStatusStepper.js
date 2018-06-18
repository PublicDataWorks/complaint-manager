import React from "react";
import { Step, Stepper, StepLabel } from "@material-ui/core";
import {CASE_STATUS_MAP} from "../../../../sharedUtilities/constants";
import {connect} from "react-redux"


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
    <Stepper
      data-test="statusStepper"
      activeStep={CASE_STATUS_MAP[status]}
      alternativeLabel
      style={{
        marginLeft: '5%',
        maxWidth: '850px',
        padding: '24px 0px'
      }}
    >
      {generateSteps(CASE_STATUS_MAP)}
    </Stepper>
  );
};

const mapStateToProps = state => ({
  status: state.currentCase.details.status
})

export default connect(mapStateToProps)(CaseStatusStepper);
