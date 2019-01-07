import {
  CASE_STATUSES_ALLOWED_TO_EDIT_LETTER,
  CASE_STATUSES_WHERE_LETTER_IS_FINALIZED,
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
  shouldNotShowMessage = () => {
    if (!this.props.featureToggles.editLetterStatusMessageFeature) {
      return true;
    }
    if (
      CASE_STATUSES_WHERE_LETTER_IS_FINALIZED.includes(this.props.caseStatus)
    ) {
      return false;
    }
    if (!CASE_STATUSES_ALLOWED_TO_EDIT_LETTER.includes(this.props.caseStatus)) {
      return true;
    }
    return this.props.letterType === LETTER_TYPE.GENERATED;
  };

  getEditLetterStatus = () => {
    if (
      CASE_STATUSES_WHERE_LETTER_IS_FINALIZED.includes(this.props.caseStatus)
    ) {
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
    if (this.shouldNotShowMessage()) {
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
  letterType: state.referralLetter.letterType
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(EditLetterStatusMessage)
);
