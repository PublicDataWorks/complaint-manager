import React, { Fragment } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import {
  CASE_STATUS,
  CASE_STATUS_MAP
} from "../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import { PrimaryButton } from "../../../shared/components/StyledButtons";

const generateSteps = map => {
  return Object.keys(map).map(key => {
    return (
      <Step key={key}>
        <StepLabel>{key}</StepLabel>
      </Step>
    );
  });
};

const CaseStatusStepper = ({ status, nextStatus }) => {
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
      {status !== CASE_STATUS.INITIAL ? (
        <div
          style={{
            marginLeft: "5%",
            maxWidth: "850px",
            paddingBottom: "24px",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <PrimaryButton data-test="updateStatusButton">
            {nextStatus}
          </PrimaryButton>
        </div>
      ) : null}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  status: state.currentCase.details.status,
  nextStatus: state.currentCase.details.nextStatus
});

export default connect(mapStateToProps)(CaseStatusStepper);
