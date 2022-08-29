import {
  CASE_STATUS,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import {
  openIncompleteClassificationsDialog,
  openIncompleteOfficerHistoryDialog,
  openMissingComplainantDialog
} from "../../../actionCreators/letterActionCreators";
import IncompleteOfficerHistoryDialog from "../../sharedFormComponents/IncompleteOfficerHistoryDialog";
import getReferralLetterData from "../../ReferralLetter/thunks/getReferralLetterData";
import IncompleteClassificationsDialog from "../../sharedFormComponents/IncompleteClassificationsDialog";
import history from "../../../../history";
import validateLetterDetails from "../../../utilities/validateLetterDetails";
import MissingComplainantDialog from "../../sharedFormComponents/MissingComplainantDialog";

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
    if (this.props.allowAccusedOfficersToBeBlankFeature) {
      return [CASE_STATUS.CLOSED].includes(this.props.status);
    } else {
      return [CASE_STATUS.INITIAL, CASE_STATUS.CLOSED].includes(
        this.props.status
      );
    }
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
    if (this.props.permissions?.includes(USER_PERMISSIONS.SETUP_LETTER)) {
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
            <MissingComplainantDialog caseId={this.props.caseId} />
            <IncompleteOfficerHistoryDialog caseId={this.props.caseId} />
            <IncompleteClassificationsDialog caseId={this.props.caseId} />
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
            <MissingComplainantDialog caseId={this.props.caseId} />
            <IncompleteOfficerHistoryDialog caseId={this.props.caseId} />
            <IncompleteClassificationsDialog caseId={this.props.caseId} />
          </Fragment>
        );
      }
    }
    return "";
  }
}

const mapStateToProps = state => ({
  accused: state.currentCase.details.accusedOfficers,
  allowAccusedOfficersToBeBlankFeature:
    state.featureToggles.allowAccusedOfficersToBeBlankFeature,
  caseId: state.currentCase.details.id,
  caseDetails: state.currentCase.details,
  status: state.currentCase.details.status,
  nextStatus: state.currentCase.details.nextStatus,
  isArchived: state.currentCase.details.isArchived,
  userInfo: state.users.current.userInfo,
  letterOfficers: state.referralLetter.letterDetails.letterOfficers,
  classifications: state.referralLetter.letterDetails.classifications,
  permissions: state?.users?.current?.userInfo?.permissions
});

const mapDispatchToProps = {
  openMissingComplainantDialog,
  openIncompleteOfficerHistoryDialog,
  openIncompleteClassificationsDialog,
  openCaseStatusUpdateDialog,
  getReferralLetterData
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusButton);
