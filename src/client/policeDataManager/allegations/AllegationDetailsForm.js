import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import {
  PrimaryButton,
  SecondaryButton
} from "../shared/components/StyledButtons";
import {
  allegationDetailsNotBlank,
  allegationDetailsRequired,
  allegationSeverityRequired
} from "../../formFieldLevelValidations";
import Dropdown from "../../common/components/Dropdown";
import { allegationSeverityMenu } from "../utilities/generateMenuOptions";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";
import { connect } from "react-redux";
import CreatableDropdown from "../../common/components/CreatableDropdown";

const AllegationDetailsForm = props => {
  const marginBottomOffset = props.marginBottomOffset || 16;
  return (
    <form style={{ justifyContent: "center" }}>
      <div>
        <Field
          style={{
            width: "60%",
            marginBottom: `${marginBottomOffset}px`
          }}
          component={CreatableDropdown}
          name="ruleChapter"
          data-testid="rule-chapter-field"
          inputProps={{ "data-testid": "rule-chapter-input" }}
          label="To Wit Chapter"
        >
          {props.ruleChapters.map(chapter => ({
            label: chapter.name,
            value: chapter.id
          }))}
        </Field>
      </div>
      <div>
        <Field
          style={{
            width: "17%",
            marginBottom: `${marginBottomOffset}px`
          }}
          component={Dropdown}
          name="severity"
          data-testid="allegation-severity-field"
          inputProps={{ "data-testid": "allegation-severity-input" }}
          label="Allegation Severity * "
          validate={[allegationSeverityRequired]}
        >
          {allegationSeverityMenu}
        </Field>
      </div>
      <div>
        <Field
          label={`${props.allegationDetailsLabel} *` || "Allegation Details *"}
          name="details"
          component={renderTextField}
          data-testid="allegation-details-field"
          inputProps={{
            autoComplete: "off",
            "data-testid": "allegation-details-input"
          }}
          validate={[allegationDetailsRequired, allegationDetailsNotBlank]}
          style={{
            width: "40%",
            marginBottom: `${marginBottomOffset}px`
          }}
          multiline
          maxRows={5}
        />
      </div>
      <div
        style={{
          display: "flex",
          marginBottom: `${marginBottomOffset}px`
        }}
      >
        {props.onCancel ? (
          <SecondaryButton
            data-testid="allegation-cancel-btn"
            onClick={props.onCancel}
            style={{ marginRight: "8px" }}
          >
            Cancel
          </SecondaryButton>
        ) : (
          ""
        )}
        <PrimaryButton
          disabled={props.invalid || props.pristine}
          data-testid="allegation-submit-btn"
          onClick={props.handleSubmit(props.onSubmit)}
        >
          {props.submitButtonText || "Submit"}
        </PrimaryButton>
      </div>
    </form>
  );
};

AllegationDetailsForm.propTypes = {
  allegationDetailsLabel: PropTypes.string,
  form: PropTypes.string.isRequired,
  marginBottomOffset: PropTypes.number,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  submitButtonText: PropTypes.string
};

const mapStateToProps = state => ({
  ruleChapters: state.ruleChapters
});

export default connect(mapStateToProps)(reduxForm({})(AllegationDetailsForm));
