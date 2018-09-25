import React, { Fragment } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { LETTER_PROGRESS_MAP } from "../../../sharedUtilities/constants";

const generateSteps = map => {
  return Object.keys(map).map(key => {
    return (
      <Step key={key}>
        <StepLabel>{key}</StepLabel>
      </Step>
    );
  });
};

const LetterProgressStepper = ({ currentLetterStatus }) => {
  return (
    <Fragment>
      <Stepper
        data-test="statusStepper"
        activeStep={LETTER_PROGRESS_MAP[currentLetterStatus]}
        alternativeLabel
        style={{ marginLeft: "5%", maxWidth: "850px", padding: "24px 0px" }}
      >
        {generateSteps(LETTER_PROGRESS_MAP)}
      </Stepper>
    </Fragment>
  );
};

export default LetterProgressStepper;
