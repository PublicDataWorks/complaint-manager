import React from "react";
import { SELECTED_INMATE_FORM } from "../../../sharedUtilities/constants";
import { connect } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  FormControlLabel
} from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import PrimaryCheckBox from "../shared/components/PrimaryCheckBox";
import { PrimaryButton } from "../shared/components/StyledButtons";
import styles from "../../common/globalStyling/styles";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";
import axios from "axios";
import { push } from "connected-react-router";
import { snackbarSuccess } from "../actionCreators/snackBarActionCreators";
import { ACCUSED } from "../../../sharedUtilities/constants";

const SelectedInmateForm = props => {
  const submit = async (values, dispatch) => {
    await axios
      .post(`api/cases/${props.caseId}/inmates`, {
        isAnonymous: values?.isAnonymous,
        notes: values?.notes,
        inmateId: props.selectedInmate.inmateId,
        roleOnCase: props.roleOnCase
      })
      .then(() => {
        dispatch(push(`/cases/${props.caseId}`));
        dispatch(
          snackbarSuccess("Person in Custody Successfully Added to Case")
        );
      });
  };

  return (
    <form onSubmit={props.handleSubmit(submit)}>
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
        Additional Info
      </Typography>
      <Card style={{ backgroundColor: "white", marginBottom: "16px" }}>
        <CardContent>
          <Typography style={styles.section}>
            {props.roleOnCase} Information
          </Typography>
          {props.roleOnCase !== ACCUSED && (
            <FormControlLabel
              data-testid="isInmateAnonymous"
              key="isAnonymous"
              label={"Anonymize Person in Custody"}
              control={<Field name="isAnonymous" component={PrimaryCheckBox} />}
            />
          )}
          <div
            style={{
              marginTop: "24px",
              marginBottom: "50px"
            }}
          >
            <Typography style={styles.section}>Notes</Typography>
            <Typography variant="body2">
              Use this section to add notes, a description, or indicate any
              information about the person in custody's history or risk
              assessment.
            </Typography>
            <Field
              component={renderTextField}
              name="notes"
              inputProps={{ "data-testid": "notesField" }}
              multiline
              maxRows={8}
              style={{ width: "60%" }}
            />
          </div>
        </CardContent>
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <PrimaryButton data-testid="inmate-submit-button">
          Create and View
        </PrimaryButton>
      </div>
    </form>
  );
};

export default reduxForm({
  form: SELECTED_INMATE_FORM
})(
  connect(state => ({
    facilities: state.facilities
  }))(SelectedInmateForm)
);
