import React from "react";
import { Typography } from "@material-ui/core";
import styles from "../../../../common/globalStyling/styles";
import { Field, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import RichTextEditor from "../../../shared/components/RichTextEditor/RichTextEditor";
import calculateOfficerHistoryTotalAllegations from "./calculateOfficerHistoryTotalAllegations";
import { numbersOnly } from "../../../utilities/fieldFormatters";
import { renderTextField } from "../../sharedFormComponents/renderFunctions";

const {
  OFFICER_HISTORY_MESSAGE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterDefaults`);

const RichTextEditorComponent = props => (
  <RichTextEditor
    initialValue={props.input.value}
    onChange={newValue => props.input.onChange(newValue)}
  />
);

class OfficerAllegationHistory extends React.Component {
  componentWillUnmount() {
    const letterOfficer = this.props.letterOfficer;

    this.props.change(`${letterOfficer}.numHistoricalHighAllegations`, null);
    this.props.change(`${letterOfficer}.numHistoricalMedAllegations`, null);
    this.props.change(`${letterOfficer}.numHistoricalLowAllegations`, null);
    this.props.change(`${letterOfficer}.historicalBehaviorNotes`, null);
    this.props.array.removeAll(
      `${letterOfficer}.referralLetterOfficerHistoryNotes`
    );
  }

  render() {
    const { letterOfficer, caseOfficerId } = this.props;
    return (
      <div>
        <Typography style={{ paddingBottom: "16px" }}>
          {OFFICER_HISTORY_MESSAGE}
        </Typography>
        <Typography>
          Please enter the number of allegations this officer has received over
          the past 5 years
        </Typography>
        <div style={{ display: "flex", marginBottom: "32px" }}>
          <Field
            style={{ margin: "8px 24px 0 0", flex: 1 }}
            name={`${letterOfficer}.numHistoricalHighAllegations`}
            component={renderTextField}
            label="High Level"
            data-testid={`${letterOfficer}-numHistoricalHighAllegations`}
            normalize={numbersOnly}
            inputProps={{ maxLength: 5, autoComplete: "off" }}
          />
          <Field
            style={{ margin: "8px 24px 0 0", flex: 1 }}
            name={`${letterOfficer}.numHistoricalMedAllegations`}
            component={renderTextField}
            label="Medium Level"
            data-testid={`${letterOfficer}-numHistoricalMedAllegations`}
            normalize={numbersOnly}
            inputProps={{ maxLength: 5, autoComplete: "off" }}
          />
          <Field
            style={{ margin: "8px 24px 0 0", flex: 1 }}
            name={`${letterOfficer}.numHistoricalLowAllegations`}
            component={renderTextField}
            label="Low Level"
            data-testid={`${letterOfficer}-numHistoricalLowAllegations`}
            normalize={numbersOnly}
            inputProps={{ maxLength: 5, autoComplete: "off" }}
          />
          <Typography
            style={{ flex: 1, marginTop: "32px" }}
            data-testid={`officers-${caseOfficerId}-total-historical-allegations`}
          >
            <b data-testid={"total-allegations-count"}>
              {calculateOfficerHistoryTotalAllegations(this.props)}
            </b>{" "}
            total allegations
          </Typography>
        </div>
        <Typography style={{ marginBottom: "8px", ...styles.inputLabel }}>
          Notes on any patterns of behavior
        </Typography>
        <div style={{ width: "75%", marginBottom: "32px" }}>
          <Field
            name={`${letterOfficer}.historicalBehaviorNotes`}
            component={RichTextEditorComponent}
            label="Notes on any patterns of behavior"
            data-testid={`${letterOfficer}-historicalBehaviorNotes`}
          />
        </div>
      </div>
    );
  }
}

const selector = formValueSelector("OfficerHistories");
const mapStateToProps = (state, props) => ({
  numHistoricalHighAllegations: selector(
    state,
    `${props.letterOfficer}.numHistoricalHighAllegations`
  ),
  numHistoricalMedAllegations: selector(
    state,
    `${props.letterOfficer}.numHistoricalMedAllegations`
  ),
  numHistoricalLowAllegations: selector(
    state,
    `${props.letterOfficer}.numHistoricalLowAllegations`
  )
});

const ConnectedForm = connect(mapStateToProps)(OfficerAllegationHistory);

export default reduxForm({
  form: "OfficerHistories",
  destroyOnUnmount: false
})(ConnectedForm);
