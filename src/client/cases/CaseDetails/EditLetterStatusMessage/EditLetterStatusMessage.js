import {
  CASE_STATUSES_WITH_ACTIVE_LETTER,
  CASE_STATUSES_AFTER_LETTER_APPROVAL,
  LETTER_TYPE
} from "../../../../sharedUtilities/constants";
import WarningMessage from "../../../shared/components/WarningMessage";
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "../caseDetailsStyles";
import { connect } from "react-redux";

export const PAGE_TYPE = {
  CASE_DETAILS: "case details",
  LETTER_DATA: "letter details"
};

export const EDIT_LETTER_STATUS = {
  EDITED: "edited",
  APPROVED: "approved"
};

class EditLetterStatusMessage extends React.Component {
  shouldShowMessage = () => {
    if (this.props.isArchived) {
      return false;
    } else if (this.letterIsApproved() || this.letterIsActiveAndEdited()) {
      return true;
    }
  };

  letterIsApproved = () => {
    return CASE_STATUSES_AFTER_LETTER_APPROVAL.includes(this.props.caseStatus);
  };

  letterIsActiveAndEdited = () => {
    return (
      CASE_STATUSES_WITH_ACTIVE_LETTER.includes(this.props.caseStatus) &&
      this.props.letterType === LETTER_TYPE.EDITED
    );
  };

  getEditLetterStatus = () => {
    if (CASE_STATUSES_AFTER_LETTER_APPROVAL.includes(this.props.caseStatus)) {
      return EDIT_LETTER_STATUS.APPROVED;
    }
    return EDIT_LETTER_STATUS.EDITED;
  };

  getMessage = () => {
    let message = `The referral letter has been ${this.getEditLetterStatus()}. `;
    message = message.concat(
      `Any changes made to the ${this.getPageType()} will not be reflected in the letter.`
    );
    return message;
  };

  getPageType = () => {
    if (this.props.pageType === PAGE_TYPE.CASE_DETAILS) {
      return PAGE_TYPE.CASE_DETAILS;
    } else {
      return PAGE_TYPE.LETTER_DATA;
    }
  };

  render() {
    if (!this.shouldShowMessage()) {
      return null;
    }

    return (
      <div
        data-test="editLetterStatusMessage"
        style={{
          maxWidth: "850px",
          paddingBottom: "24px",
          display: "flex"
        }}
      >
        <WarningMessage>{this.getMessage()}</WarningMessage>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  featureToggles: state.featureToggles,
  caseStatus: state.currentCase.details.status,
  letterType: state.referralLetter.letterType,
  isArchived: state.currentCase.details.isArchived
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(EditLetterStatusMessage)
);
