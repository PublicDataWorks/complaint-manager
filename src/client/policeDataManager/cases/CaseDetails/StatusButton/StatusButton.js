import {
  CASE_STATUS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import React, { Component, Fragment, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import {
  openIncompleteClassificationsDialog,
  openIncompleteOfficerHistoryDialog,
  openMissingComplainantDialog
} from "../../../actionCreators/letterActionCreators";
import getReferralLetterData from "../../ReferralLetter/thunks/getReferralLetterData";
import history from "../../../../history";
import validateLetterDetails from "../../../utilities/validateLetterDetails";
const IncompleteClassificationsDialog = lazy(() =>
  import("../../sharedFormComponents/IncompleteClassificationsDialog")
);
const IncompleteOfficerHistoryDialog = lazy(() =>
  import("../../sharedFormComponents/IncompleteOfficerHistoryDialog")
);
const MissingComplainantDialog = lazy(() =>
  import("../../sharedFormComponents/MissingComplainantDialog")
);

class StatusButton extends Component {
  componentDidMount() {
    if (
      (this.props.status === CASE_STATUS.LETTER_IN_PROGRESS ||
        this.props.status === CASE_STATUS.READY_FOR_REVIEW) &&
      !this.props.isArchived
    ) {
      this.props.getReferralLetterData(this.props.caseId);
    }
  }

  currentStatusDoesNotNeedButton = () => {
    return [CASE_STATUS.INITIAL, CASE_STATUS.CLOSED].includes(
      this.props.status
    );
  };

  userDoesNotHavePermissionToChangeStatus = () => {
    const { userInfo, status } = this.props;
    return (
      [CASE_STATUS.READY_FOR_REVIEW, CASE_STATUS.FORWARDED_TO_AGENCY].includes(
        status
      ) &&
      (!userInfo ||
        !userInfo.permissions.includes(
          USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES
        ))
    );
  };

  openUpdateCaseStatusDialog = async () => {
    const { nextStatus, caseId } = this.props;
    let redirectUrl;
    let isValidLetterDetails;

    if (nextStatus === CASE_STATUS.LETTER_IN_PROGRESS) {
      redirectUrl = `/cases/${caseId}/letter/review`;
    }
    if (nextStatus === CASE_STATUS.READY_FOR_REVIEW) {
      isValidLetterDetails = await validateLetterDetails(this.props);
      if (!isValidLetterDetails) return;
    }
    this.props.openCaseStatusUpdateDialog(nextStatus, redirectUrl);
  };

  saveAndGoToReviewAndApprove = async values => {
    values.preventDefault();
    const isLetterValid = await validateLetterDetails(this.props);
    if (isLetterValid) {
      history.push(`/cases/${this.props.caseId}/letter/review-and-approve`);
    }
  };

  render() {
    const { status, caseId, nextStatus } = this.props;

    if (
      this.currentStatusDoesNotNeedButton() ||
      this.userDoesNotHavePermissionToChangeStatus()
    ) {
      return "";
    }

    if (status === CASE_STATUS.READY_FOR_REVIEW) {
      return (
        <Fragment>
          <PrimaryButton
            data-testid={"review-and-approve-letter-button"}
            onClick={this.saveAndGoToReviewAndApprove}
            style={{ marginLeft: "16px" }}
            disabled={this.props.isArchived}
          >
            Review and Approve Letter
          </PrimaryButton>
          <Suspense
            fallback={() => (
              <CircularProgress data-testid="spinner" size={30} />
            )}
          >
            <MissingComplainantDialog caseId={this.props.caseId} />
            <IncompleteOfficerHistoryDialog caseId={this.props.caseId} />
            <IncompleteClassificationsDialog caseId={this.props.caseId} />
          </Suspense>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <PrimaryButton
            data-testid="update-status-button"
            onClick={this.openUpdateCaseStatusDialog}
            style={{ marginLeft: "16px" }}
            disabled={this.props.isArchived}
          >
            {status === CASE_STATUS.ACTIVE
              ? `Begin Letter`
              : `Mark as ${nextStatus}`}
          </PrimaryButton>
          <Suspense
            fallback={() => (
              <CircularProgress data-testid="spinner" size={30} />
            )}
          >
            <MissingComplainantDialog caseId={this.props.caseId} />
            <IncompleteOfficerHistoryDialog caseId={this.props.caseId} />
            <IncompleteClassificationsDialog caseId={this.props.caseId} />
          </Suspense>
        </Fragment>
      );
    }
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  caseDetails: state.currentCase.details,
  status: state.currentCase.details.status,
  nextStatus: state.currentCase.details.nextStatus,
  isArchived: state.currentCase.details.isArchived,
  userInfo: state.users.current.userInfo,
  letterOfficers: state.referralLetter.letterDetails.letterOfficers,
  classifications: state.referralLetter.letterDetails.classifications
});

const mapDispatchToProps = {
  openMissingComplainantDialog,
  openIncompleteOfficerHistoryDialog,
  openIncompleteClassificationsDialog,
  openCaseStatusUpdateDialog,
  getReferralLetterData
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusButton);
