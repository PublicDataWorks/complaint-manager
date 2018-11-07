import React, { Fragment } from "react";
import { Step, StepLabel, Stepper, StepButton } from "@material-ui/core";
import { LETTER_PROGRESS_MAP } from "../../../sharedUtilities/constants";
import { push } from "react-router-redux";

const LetterProgressStepper = ({
  currentLetterStatus,
  pageChangeCallback,
  caseId,
  dispatch
}) => {
  const generateSteps = map => {
    return Object.keys(map).map(key => {
      const redirectUrl = determineRedirectUrl(key);
      return (
        <Step key={key} completed={false}>
          <StepButton
            onClick={handlePageChange(redirectUrl)}
            data-test={`step-button-${key}`}
          >
            <StepLabel>{key}</StepLabel>
          </StepButton>
        </Step>
      );
    });
  };

  const handlePageChange = redirectUrl => {
    if (pageChangeCallback) {
      return pageChangeCallback(redirectUrl);
    }
    return dispatch(push(redirectUrl));
  };

  const determineRedirectUrl = key => {
    switch (key) {
      case "Review Case Details":
        return `/cases/${caseId}/letter/review`;
      case "Officer Complaint Histories":
        return `/cases/${caseId}/letter/officer-history`;
      case "IAPro Corrections":
        return `/cases/${caseId}/letter/iapro-corrections`;
      case "Recommended Actions":
        return `/cases/${caseId}/letter/recommended-actions`;
      case "Preview":
        return `/cases/${caseId}/letter/letter-preview`;
    }
  };

  return (
    <Fragment>
      <Stepper
        nonLinear
        data-test="statusStepper"
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
