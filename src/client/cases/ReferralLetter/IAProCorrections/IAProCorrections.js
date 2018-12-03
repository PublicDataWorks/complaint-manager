import React, { Component, Fragment } from "react";
import getReferralLetterData from "../thunks/getReferralLetterData";
import { LETTER_PROGRESS } from "../../../../sharedUtilities/constants";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LetterProgressStepper from "../LetterProgressStepper";
import LinkButton from "../../../shared/components/LinkButton";
import { Field, FieldArray, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { TextField } from "redux-form-material-ui";
import { openRemoveIAProCorrectionDialog } from "../../../actionCreators/letterActionCreators";

import _ from "lodash";
import shortid from "shortid";
import RemoveIAProCorrectionDialog from "./RemoveIAProCorrectionDialog";
import editIAProCorrections from "../thunks/editIAProCorrections";
import {
  PrimaryButton,
  SecondaryButton
} from "../../../shared/components/StyledButtons";

class IAProCorrections extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id };
  }

  componentDidMount() {
    this.props.dispatch(getReferralLetterData(this.state.caseId));
  }

  saveAndReturnToCase = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}`)
    );
  };

  saveAndGoBackToOfficerHistories = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/officer-history`)
    );
  };

  saveAndGoToNextPage = () => {
    return this.props.handleSubmit(
      this.submitForm(`/cases/${this.state.caseId}/letter/recommended-actions`)
    );
  };

  pageChangeCallback = redirectUrl => {
    return this.props.handleSubmit(this.submitForm(redirectUrl));
  };

  submitForm = redirectUrl => (values, dispatch) => {
    dispatch(editIAProCorrections(this.state.caseId, values, redirectUrl));
  };

  referralLetterNotYetLoaded = () => {
    return (
      _.isEmpty(this.props.letterDetails) ||
      `${this.props.letterDetails.caseId}` !== this.state.caseId
    );
  };

  renderIAProCorrectionsFields = fields => {
    return fields.map((iaProCorrectionsField, index) => {
      const iaproCorrectionInstance = fields.get(index);
      const uniqueKey =
        iaproCorrectionInstance.id || iaproCorrectionInstance.tempId;
      return (
        <Card
          key={uniqueKey}
          style={{
            marginBottom: "24px",
            backgroundColor: "white"
          }}
        >
          <CardContent style={{ backgroundColor: "white" }}>
            <div
              data-test="iapro-correction"
              style={{ display: "flex", width: "100%" }}
            >
              <Field
                style={{ flex: 4 }}
                name={`${iaProCorrectionsField}.details`}
                component={TextField}
                label="Correction Description"
                data-test={`${iaProCorrectionsField}-details`}
                fullWidth
                multiline
                rowsMax={10}
              />
              <div style={{ textAlign: "right", flex: 1, paddingTop: "16px" }}>
                <LinkButton
                  data-test={`${iaProCorrectionsField}-open-remove-dialog-button`}
                  style={{ textAlign: "right" }}
                  onClick={() => {
                    this.props.openRemoveIAProCorrectionDialog(
                      "referralLetterIAProCorrections",
                      index
                    );
                  }}
                >
                  Remove
                </LinkButton>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    });
  };

  addNewIAProCorrection = fields => () => {
    const newIAProCorrection = { tempId: shortid.generate() };
    fields.push(newIAProCorrection);
  };

  renderIAProCorrections = ({ fields }) => {
    return (
      <Fragment>
        {this.renderIAProCorrectionsFields(fields)}
        <LinkButton
          onClick={this.addNewIAProCorrection(fields)}
          data-test="addIAProCorrectionButton"
        >
          + Add A Correction
        </LinkButton>
      </Fragment>
    );
  };

  render() {
    if (this.referralLetterNotYetLoaded()) {
      return null;
    }

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${this.state.caseId}   : Letter Generation`}
          </Typography>
        </NavBar>

        <form>
          <LinkButton
            data-test="save-and-return-to-case-link"
            onClick={this.saveAndReturnToCase()}
            style={{ margin: "2% 0% 2% 4%" }}
          >
            Back to Case
          </LinkButton>

          <div style={{ margin: "0% 5% 3%", maxWidth: "60rem" }}>
            <LetterProgressStepper
              currentLetterStatus={LETTER_PROGRESS.IAPRO_CORRECTIONS}
              pageChangeCallback={this.pageChangeCallback}
              caseId={this.state.caseId}
            />
            <div style={{ margin: "0 0 32px 0" }}>
              <Typography
                variant="title"
                data-test="iapro-corrections-page-header"
              >
                IAPro Corrections
              </Typography>
            </div>
            <div style={{ marginBottom: "32px" }}>
              <FieldArray
                name="referralLetterIAProCorrections"
                component={this.renderIAProCorrections}
              />
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ flex: 1 }}>
                <SecondaryButton
                  onClick={this.saveAndGoBackToOfficerHistories()}
                  data-test="back-button"
                >
                  Back
                </SecondaryButton>
              </span>
              <span style={{ flex: 1, textAlign: "right" }}>
                <PrimaryButton
                  onClick={this.saveAndGoToNextPage()}
                  data-test="next-button"
                >
                  Next
                </PrimaryButton>
              </span>
            </div>
          </div>
        </form>
        <RemoveIAProCorrectionDialog removeFunction={this.props.array.remove} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  openRemoveIAProCorrectionDialog
};

const mapStateToProps = state => ({
  letterDetails: state.referralLetter.letterDetails,
  initialValues: {
    referralLetterIAProCorrections:
      state.referralLetter.letterDetails.referralLetterIAProCorrections
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({ form: "IAProCorrections", enableReinitialize: true })(
    IAProCorrections
  )
);
