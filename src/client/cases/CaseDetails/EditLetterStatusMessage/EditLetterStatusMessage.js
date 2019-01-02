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

class EditLetterStatusMessage extends React.Component {
  shouldNotShowMessage = () => {
    if (!this.props.featureToggles.editLetterStatusMessageFeature) {
      return true;
    }
    if (!CASE_STATUSES_ALLOWED_TO_EDIT_LETTER.includes(this.props.caseStatus)) {
      return true;
    }
    return this.props.letterType === LETTER_TYPE.GENERATED;
  };

  render() {
    if (this.shouldNotShowMessage()) {
      return null;
    }

    let editLetterStatus = "edited";
    if (
      CASE_STATUSES_WHERE_LETTER_IS_FINALIZED.includes(this.props.caseStatus)
    ) {
      editLetterStatus = "approved";
    }

    return (
      <div
        data-test="editLetterStatusMessage"
        style={{
          marginRight: "5%",
          marginLeft: "5%",
          maxWidth: "850px",
          paddingBottom: "24px",
          display: "flex"
        }}
      >
        <WarningMessage>
          {`The referral letter has been ${editLetterStatus}. Any changes made to the ${"case details"} will not be reflected in the letter.`}
        </WarningMessage>
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
