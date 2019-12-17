import React from "react";
import { Field, reduxForm, submit } from "redux-form";
import updateNarrative from "../thunks/updateNarrative";
import { CardActions, CardContent, Typography } from "@material-ui/core";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import BaseCaseDetailsCard from "./BaseCaseDetailsCard";
import { NARRATIVE_FORM } from "../../../../sharedUtilities/constants";
import { renderTextField } from "../sharedFormComponents/renderFunctions";

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
            disabled={props.isArchived}
            component={renderTextField}
            fullWidth
            multiline
            rowsMax={5}
            placeholder={
              props.isArchived
                ? ""
                : "Enter a brief, 2-3 sentence summary of the incident"
            }
            inputProps={{
              "data-test": "narrativeSummaryInput",
              maxLength: 500,
              style: {
                color: "black"
              }
            }}
            InputLabelProps={{
              style: {
                color: "black"
              },
              shrink: true
            }}
            data-test="narrativeSummaryField"
            style={{ marginBottom: "24px" }}
          />
          <Field
            name="narrativeDetails"
            label="Narrative Details"
            disabled={props.isArchived}
            component={renderTextField}
            fullWidth
            multiline
            rowsMax={20}
            rows={5}
            placeholder={
              props.isArchived
                ? ""
                : "Enter a transcript or details of the incident"
            }
            inputProps={{
              "data-test": "narrativeDetailsInput",
              style: {
                color: "black"
              }
            }}
            InputLabelProps={{
              style: {
                color: "black"
              },
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
        {props.isArchived ? null : (
          <PrimaryButton
            data-test="saveNarrative"
            disabled={props.pristine}
            onClick={() => props.dispatch(submit(NARRATIVE_FORM))}
            style={{ margin: "0px" }}
          >
            Save
          </PrimaryButton>
        )}
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
  form: NARRATIVE_FORM,
  onSubmit: dispatchUpdateNarrative,
  enableReinitialize: true
})(Narrative);
