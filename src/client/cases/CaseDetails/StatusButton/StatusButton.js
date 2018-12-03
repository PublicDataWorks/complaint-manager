import {
  CASE_STATUS,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { Link } from "react-router-dom";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { openCaseStatusUpdateDialog } from "../../../actionCreators/casesActionCreators";

class StatusButton extends Component {
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

  openUpdateCaseStatusDialog = () => {
    const { nextStatus, caseId } = this.props;
    let redirectUrl;
    if (nextStatus === CASE_STATUS.LETTER_IN_PROGRESS) {
      redirectUrl = `/cases/${caseId}/letter/review`;
    }
    this.props.dispatch(openCaseStatusUpdateDialog(redirectUrl));
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
        <PrimaryButton
          data-test={"review-and-approve-letter-button"}
          to={`/cases/${caseId}/letter/review-and-approve`}
          component={Link}
          style={{ marginLeft: "16px" }}
        >
          Review and Approve Letter
        </PrimaryButton>
      );
    } else {
      return (
        <PrimaryButton
          data-test="update-status-button"
          onClick={this.openUpdateCaseStatusDialog}
          style={{ marginLeft: "16px" }}
        >
          {status === CASE_STATUS.ACTIVE
            ? `Begin Letter`
            : `Mark as ${nextStatus}`}
        </PrimaryButton>
      );
    }
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  status: state.currentCase.details.status,
  nextStatus: state.currentCase.details.nextStatus,
  userInfo: state.users.current.userInfo
});

export default connect(mapStateToProps)(StatusButton);
