import React, { Fragment } from "react";
import { Step, StepButton, StepLabel, Stepper } from "@material-ui/core";
import {
  LETTER_PROGRESS,
  LETTER_PROGRESS_MAP
} from "../../../../sharedUtilities/constants";

const LetterProgressStepper = ({
  currentLetterStatus,
  pageChangeCallback,
  caseId
}) => {
  const LETTER_REDIRECT_URL_MAP = {
    [LETTER_PROGRESS.REVIEW_CASE_DETAILS]: `/cases/${caseId}/letter/review`,
    [LETTER_PROGRESS.OFFICER_COMPLAINT_HISTORIES]: `/cases/${caseId}/letter/officer-history`,
    [LETTER_PROGRESS.RECOMMENDED_ACTIONS]: `/cases/${caseId}/letter/recommended-actions`,
    [LETTER_PROGRESS.PREVIEW]: `/cases/${caseId}/letter/letter-preview`
  };

  const generateSteps = map => {
    return Object.keys(map).map(key => {
      return (
        <Step key={key} completed={false}>
          <StepButton
            onClick={handlePageChange(key)}
            data-testid={`step-button-${key}`}
          >
            <StepLabel>{key}</StepLabel>
          </StepButton>
        </Step>
      );
    });
  };

  const handlePageChange = key => {
    return pageChangeCallback(LETTER_REDIRECT_URL_MAP[key]);
  };

  return (
    <Fragment>
      <Stepper
        nonLinear
        data-testid="statusStepper"
        activeStep={LETTER_PROGRESS_MAP[currentLetterStatus]}
        alternativeLabel
        style={{ margin: "0 0 3% 5%", padding: "24px 0px" }}
      >
        {generateSteps(LETTER_PROGRESS_MAP)}
      </Stepper>
    </Fragment>
  );
};

export default LetterProgressStepper;
