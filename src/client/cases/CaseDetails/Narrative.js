import React from "react";
import { Field, reduxForm, submit } from "redux-form";
import { TextField } from "redux-form-material-ui";
import updateNarrative from "../thunks/updateNarrative";
import { CardActions, CardContent, Typography } from "@material-ui/core";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import BaseCaseDetailsCard from "./BaseCaseDetailsCard";

const Narrative = props => {
  return (
    <BaseCaseDetailsCard title="Narrative">
      <CardContent>
        <Typography
          style={{
            marginBottom: "24px"
          }}
        >
          Record information gained during the intake process. This information
          will be used to populate a detailed account section of the referral
          letter.
        </Typography>
        <form data-test="createUserForm">
          <Field
            name="narrativeSummary"
            label="Narrative Summary"
            component={TextField}
            fullWidth
            multiline
            rowsMax={5}
            placeholder="Enter a brief, 2-3 sentence summary of the incident"
            inputProps={{
              "data-test": "narrativeSummaryInput",
              maxLength: 500
            }}
            InputLabelProps={{
              shrink: true
            }}
            data-test="narrativeSummaryField"
            style={{ marginBottom: "24px" }}
          />
          <Field
            name="narrativeDetails"
            label="Narrative Details"
            component={TextField}
            fullWidth
            multiline
            rowsMax={20}
            rows={5}
            placeholder="Enter a transcript or details of the incident"
            inputProps={{
              "data-test": "narrativeDetailsInput"
            }}
            InputLabelProps={{
              shrink: true
            }}
            data-test="narrativeDetailsField"
          />
        </form>
      </CardContent>
      <CardActions
        style={{
          justifyContent: "flex-end",
          paddingRight: "0px",
          padding: "0px 16px 16px 0px"
        }}
      >
        <PrimaryButton
          data-test="saveNarrative"
          disabled={props.pristine}
          onClick={() => props.dispatch(submit("Narrative"))}
          style={{ margin: "0px" }}
        >
          Save
        </PrimaryButton>
      </CardActions>
    </BaseCaseDetailsCard>
  );
};

const dispatchUpdateNarrative = (values, dispatch, props) => {
  const updateDetails = {
    ...values,
    id: props.caseId
  };
  dispatch(updateNarrative(updateDetails));
};

export default reduxForm({
  form: "Narrative",
  onSubmit: dispatchUpdateNarrative,
  enableReinitialize: true
})(Narrative);
