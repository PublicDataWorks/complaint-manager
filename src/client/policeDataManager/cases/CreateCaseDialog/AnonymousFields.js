import { FormControlLabel } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Field, change } from "redux-form";
import { CREATE_CASE_FORM_NAME } from "../../../../sharedUtilities/constants";
import PrimaryCheckBox from "../../shared/components/PrimaryCheckBox";

const AnonymousFields = props => (
  <section style={{ display: "flex" }}>
    <FormControlLabel
      label="Known Anonymous"
      control={
        <Field name="civilian.isAnonymous" component={PrimaryCheckBox} />
      }
      onChange={e => {
        if (e.target.checked) {
          props.change(CREATE_CASE_FORM_NAME, "civilian.isUnknown", false);
        }
      }}
    />
    <FormControlLabel
      label="Unknown Anonymous"
      control={<Field name="civilian.isUnknown" component={PrimaryCheckBox} />}
      onChange={e => {
        if (e.target.checked) {
          props.change(CREATE_CASE_FORM_NAME, "civilian.isAnonymous", false);
        }
      }}
    />
  </section>
);

export default connect(undefined, { change })(AnonymousFields);
