import React, {Fragment} from "react";
import {Step, StepLabel, Stepper} from "@material-ui/core";
import {CASE_STATUS, CASE_STATUS_MAP} from "../../../../sharedUtilities/constants";
import {connect} from "react-redux";
import {PrimaryButton} from "../../../shared/components/StyledButtons";
import UpdateCaseStatusDialog from "../UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import {openCaseStatusUpdateDialog} from "../../../actionCreators/casesActionCreators";

const generateSteps = map => {
  return Object.keys(map).map(key => {
    return (
      <Step key={key}>
        <StepLabel>{key}</StepLabel>
      </Step>
    );
  });
};

const CaseStatusStepper = ({ caseId, status, nextStatus, dispatch }) => {
  return <Fragment>
      <Stepper data-test="statusStepper" activeStep={CASE_STATUS_MAP[status]} alternativeLabel style={{ marginLeft: "5%", maxWidth: "850px", padding: "24px 0px" }}>
        {generateSteps(CASE_STATUS_MAP)}
      </Stepper>
      {status !== CASE_STATUS.INITIAL && status !== CASE_STATUS.READY_FOR_REVIEW ? <div style={{ marginLeft: "5%", maxWidth: "850px", paddingBottom: "24px", display: "flex", justifyContent: "flex-end" }}>
          <PrimaryButton data-test="updateStatusButton" onClick={() => {
              dispatch(openCaseStatusUpdateDialog(nextStatus));
            }}>
            {`Mark as ${nextStatus}`}
          </PrimaryButton>
        </div> : null}
      <UpdateCaseStatusDialog />
    </Fragment>;
};

const mapStateToProps = state => ({
  status: state.currentCase.details.status,
  nextStatus: state.currentCase.details.nextStatus
});

export default connect(mapStateToProps)(CaseStatusStepper);
