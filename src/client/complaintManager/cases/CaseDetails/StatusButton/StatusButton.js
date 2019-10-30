import {
  CASE_STATUS,
  UNKNOWN_OFFICER_NAME,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";
import {
  openIncompleteClassificationsDialog,
  openIncompleteOfficerHistoryDialog
} from "../../../actionCreators/letterActionCreators";
import IncompleteOfficerHistoryDialog from "../../sharedFormComponents/IncompleteOfficerHistoryDialog";
import getReferralLetterData from "../../ReferralLetter/thunks/getReferralLetterData";
import _ from "lodash";
import IncompleteClassificationsDialog from "../../sharedFormComponents/IncompleteClassificationsDialog";
import history from "../../../../history";
import validateLetterDetails from "../../../utilities/validateLetterDetails";

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
    if (nextStatus === CASE_STATUS.LETTER_IN_PROGRESS) {
      redirectUrl = `/cases/${caseId}/letter/review`;
    }
    if (nextStatus === CASE_STATUS.READY_FOR_REVIEW) {
      await validateLetterDetails(this.props);
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
            data-test={"review-and-approve-letter-button"}
            onClick={this.saveAndGoToReviewAndApprove}
            style={{ marginLeft: "16px" }}
            disabled={this.props.isArchived}
          >
            Review and Approve Letter
          </PrimaryButton>
          <IncompleteOfficerHistoryDialog caseId={this.props.caseId} />
          <IncompleteClassificationsDialog caseId={this.props.caseId} />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <PrimaryButton
            data-test="update-status-button"
            onClick={this.openUpdateCaseStatusDialog}
            style={{ marginLeft: "16px" }}
            disabled={this.props.isArchived}
          >
            {status === CASE_STATUS.ACTIVE
              ? `Begin Letter`
              : `Mark as ${nextStatus}`}
          </PrimaryButton>
          <IncompleteOfficerHistoryDialog caseId={this.props.caseId} />
          <IncompleteClassificationsDialog caseId={this.props.caseId} />
        </Fragment>
      );
    }
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  status: state.currentCase.details.status,
  nextStatus: state.currentCase.details.nextStatus,
  isArchived: state.currentCase.details.isArchived,
  userInfo: state.users.current.userInfo,
  letterOfficers: state.referralLetter.letterDetails.letterOfficers,
  classifications: state.referralLetter.letterDetails.classifications,
  classificationFeature: state.featureToggles.classificationFeature
});

const mapDispatchToProps = {
  openIncompleteOfficerHistoryDialog,
  openIncompleteClassificationsDialog,
  openCaseStatusUpdateDialog,
  getReferralLetterData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusButton);
