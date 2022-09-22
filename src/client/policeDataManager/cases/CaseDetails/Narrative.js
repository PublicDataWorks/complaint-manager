import React from "react";
import { Field, reduxForm, submit } from "redux-form";
import updateNarrative from "../thunks/updateNarrative";
import { CardActions, CardContent, Typography } from "@material-ui/core";
import DetailsCard from "../../shared/components/DetailsCard";
import {
  NARRATIVE_FORM,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { renderTextField } from "../sharedFormComponents/renderFunctions";
import { RichTextEditorComponent } from "../../shared/components/RichTextEditor/RichTextEditor";
import standards from "../../../common/globalStyling/standards";
import { connect } from "react-redux";

const Narrative = props => {
  const onBlur = () => {
    if (props.dirty && !props.isArchived) {
      props.dispatch(submit(NARRATIVE_FORM));
    }
  };

  return (
    <DetailsCard title="Narrative" maxWidth="850px">
      <CardContent>
        <Typography
          data-testid={"narrativePromptDetails"}
          style={{
            marginBottom: "24px"
          }}
        >
          Record information gained during the intake process. This information
          will be used to populate a detailed account section of the referral
          letter.
        </Typography>
        <form data-testid="createUserForm">
          <Field
            name="narrativeSummary"
            label="Narrative Summary"
            onBlur={onBlur}
            disabled={
              props.isArchived ||
              !props.permissions?.includes(USER_PERMISSIONS.EDIT_CASE)
            }
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
              "data-testid": "narrativeSummaryInput",
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
            data-testid="narrativeSummaryField"
            style={{ marginBottom: "24px" }}
          />
          <Typography
            style={{
              marginBottom: "8px",
              fontSize: standards.fontTiny
            }}
          >
            Narrative Details
          </Typography>
          <Field
            name="narrativeDetails"
            label="Narrative Details"
            disabled={
              props.isArchived ||
              !props.permissions?.includes(USER_PERMISSIONS.EDIT_CASE)
            }
            component={RichTextEditorComponent}
            handleBlur={onBlur}
            placeholder={
              props.isArchived
                ? ""
                : "Enter a transcript or details of the incident"
            }
            fullWidth
            multiline
            rowsMax={20}
            rows={5}
            inputProps={{
              "data-testid": "narrativeDetailsInput",
              style: {
                color: "black"
              }
            }}
            data-testid="narrativeDetailsField"
          />
        </form>
      </CardContent>
      <CardActions
        style={{
          justifyContent: "flex-end",
          paddingRight: "0px",
          padding: "0px 16px 16px 0px"
        }}
      ></CardActions>
    </DetailsCard>
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
})(
  connect(state => ({
    permissions: state?.users?.current?.userInfo?.permissions
  }))(Narrative)
);
