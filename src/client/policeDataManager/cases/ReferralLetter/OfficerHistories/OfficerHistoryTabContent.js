import React, { Fragment } from "react";
import { FormControlLabel, Radio, Typography } from "@material-ui/core";
import styles from "../../../../common/globalStyling/styles";
import { Field, FieldArray, reduxForm } from "redux-form";
import { connect } from "react-redux";
import OfficerHistoryNote from "./OfficerHistoryNote";
import LinkButton from "../../../shared/components/LinkButton";
import shortid from "shortid";
import OfficerAllegationHistory from "./OfficerAllegationHistory";
import getOfficerHistoryOptionsRadioButtonValues from "../thunks/getOfficerHistoryOptionsRadioButtonValues";
import { UNKNOWN_OFFICER_NAME } from "../../../../../sharedUtilities/constants";
import { renderRadioGroup } from "../../sharedFormComponents/renderFunctions";

const { ORGANIZATION } = require(`${process.env.INSTANCE_FILES_DIR}/constants`);

class OfficerHistoryTabContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOfficerHistoryOption:
        this.props.letterOfficers[this.props.letterOfficerIndex]
          .officerHistoryOptionId
    };
  }

  componentDidMount() {
    this.props.dispatch(getOfficerHistoryOptionsRadioButtonValues());
  }

  addNewOfficerNote = fields => () =>
    fields.push({ tempId: shortid.generate() });

  renderNoteFields = ({ fields }) => (
    <Fragment>
      {this.renderOfficerHistoryNotes(fields)}
      <LinkButton
        onClick={this.addNewOfficerNote(fields)}
        data-testid="addOfficerHistoryNoteButton"
      >
        + Add A Note
      </LinkButton>
    </Fragment>
  );

  renderOfficerHistoryNotes = fields =>
    fields.map((noteField, index) => {
      const { id, tempId } = fields.get(index);
      return (
        <OfficerHistoryNote
          referralLetterOfficerHistoryNote={noteField}
          key={id || tempId}
          fieldArrayName={`${this.props.letterOfficer}.referralLetterOfficerHistoryNotes`}
          noteIndex={index}
          caseOfficerName={this.props.caseOfficerName}
        />
      );
    });

  renderAllegationRadioButtons = letterOfficer => {
    return (
      <Field
        name={`${letterOfficer}.officerHistoryOptionId`}
        component={renderRadioGroup}
        style={{ flexDirection: "column", marginLeft: "24px" }}
        data-testid="officerHistoryOptionRadioGroup"
        onChange={(event, value) =>
          this.setState({
            selectedOfficerHistoryOption: value
          })
        }
      >
        {this.props.officerHistoryOptions.map(historyOption => {
          return (
            <FormControlLabel
              value={historyOption.id.toString()}
              control={<Radio color="primary" />}
              label={historyOption.name}
              key={historyOption.id}
              data-testid={`${letterOfficer}-option-${historyOption.id}`}
            />
          );
        })}
      </Field>
    );
  };

  renderKnownOfficerAllegationHistoryTabContent = (
    letterOfficer,
    caseOfficerId,
    caseOfficerName
  ) => {
    return (
      <div>
        {caseOfficerName !== UNKNOWN_OFFICER_NAME ? (
          <div>
            {this.renderAllegationRadioButtons(letterOfficer)}
            {this.state.selectedOfficerHistoryOption === "4" ? (
              <Fragment>
                <OfficerAllegationHistory
                  letterOfficer={letterOfficer}
                  caseOfficerId={caseOfficerId}
                />
                <Typography
                  style={{ paddingBottom: "16px", ...styles.section }}
                >
                  Notes
                </Typography>
                <FieldArray
                  name={`${letterOfficer}.referralLetterOfficerHistoryNotes`}
                  component={this.renderNoteFields}
                />
              </Fragment>
            ) : null}
          </div>
        ) : (
          <p>
            The {ORGANIZATION} is unable to review this officer’s disciplinary
            history as they are unable to be identified at this time.
          </p>
        )}
      </div>
    );
  };

  render() {
    const { letterOfficer, caseOfficerName, caseOfficerId, isSelectedOfficer } =
      this.props;
    const display = isSelectedOfficer ? "block" : "none";

    return (
      <div
        style={{ padding: "24px", display }}
        key={caseOfficerId}
        data-testid={`tab-content-${caseOfficerId}`}
      >
        <Typography
          variant="h6"
          style={{ paddingBottom: "16px", ...styles.section }}
        >
          {caseOfficerName}
        </Typography>
        <div>
          {this.renderKnownOfficerAllegationHistoryTabContent(
            letterOfficer,
            caseOfficerId,
            caseOfficerName
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  letterOfficers: state.referralLetter.letterDetails.letterOfficers,
  officerHistoryOptions: state.ui.officerHistoryOptions
});

const ConnectedForm = connect(mapStateToProps)(OfficerHistoryTabContent);

export default reduxForm({
  form: "OfficerHistories",
  destroyOnUnmount: false
})(ConnectedForm);
