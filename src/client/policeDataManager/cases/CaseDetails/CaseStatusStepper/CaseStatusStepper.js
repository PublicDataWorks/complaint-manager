import React, { Fragment, useEffect } from "react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";
import { connect } from "react-redux";
import UpdateCaseStatusDialog from "../UpdateCaseStatusDialog/UpdateCaseStatusDialog";
import DownloadFinalLetterButton from "../DownloadFinalLetterButton/DownloadFinalLetterButton";
import EditLetterButton from "../EditLetterButton/EditLetterButton";
import StatusButton from "../StatusButton/StatusButton";
import GenerateLetterButton from "../GenerateLetterButton/GenerateLetterButton";
import getActiveStep from "./getActiveStep";
import getCaseStatuses from "../../thunks/getCaseStatuses";
import { mapCaseStatuses } from "./case-status-selector";

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
  isArchived,
  permissions,
  caseStatuses,
  getCaseStatuses,
  generateLetterButtonFeatureFlag
}) => {
  useEffect(() => {
    if (!Object.keys(caseStatuses).length) {
      getCaseStatuses();
    }
  }, []);

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
        {!permissions?.includes(USER_PERMISSIONS.SETUP_LETTER) ? null : (
          <div>
            {isArchived ||
            !permissions?.includes(USER_PERMISSIONS.SETUP_LETTER) ? null : (
              <EditLetterButton status={status} caseId={caseId} />
            )}
            <StatusButton />
            {!generateLetterButtonFeatureFlag ? <GenerateLetterButton /> : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      <Stepper
        data-testid="statusStepper"
        activeStep={getActiveStep(caseStatuses, status)}
        alternativeLabel
        style={{ marginLeft: "5%", maxWidth: "850px", padding: "24px 0px" }}
      >
        {generateSteps(caseStatuses)}
      </Stepper>
      {renderButtons()}
      <UpdateCaseStatusDialog />
    </Fragment>
  );
};

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  status: state.currentCase.details.status,
  isArchived: state.currentCase.details.isArchived,
  permissions: state?.users?.current?.userInfo?.permissions,
  caseStatuses: mapCaseStatuses(state),
  generateLetterButtonFeatureFlag:
    state.featureToggles.chooseGenerateLetterButton
});

export default connect(mapStateToProps, { getCaseStatuses })(CaseStatusStepper);
