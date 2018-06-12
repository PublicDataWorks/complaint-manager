import React from "react";
import OfficerSearchTableHeader from "../OfficerSearch/OfficerSearchTableHeader";
import { Card, CardContent, Table, TableBody, Typography } from "@material-ui/core";
import OfficerSearchResultsRow from "../OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow";
import { TextField } from "redux-form-material-ui";
import OfficerTypeRadioGroup from "./OfficerTypeRadioGroup";
import { Field, reduxForm } from "redux-form";
import styles from "../../globalStyling/styles";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import { ChangeOfficer } from "../OfficerSearch/OfficerSearchResults/officerSearchResultsRowButtons";
import { connect } from "react-redux";

const OfficerDetails = props => {
  const onSubmit = (values, dispatch) => {
    dispatch(props.submitAction(values));
  };
  return (
    <div>
      <Typography variant="title">Selected Officer</Typography>
      {props.selectedOfficerData ? (
        <Table style={{ marginBottom: "32px" }}>
          <OfficerSearchTableHeader />
          <TableBody>
            <OfficerSearchResultsRow officer={props.selectedOfficerData}>
              <ChangeOfficer
                caseId={props.caseId}
                dispatch={props.dispatch}
                officerSearchUrl={props.officerSearchUrl}
              >
                change
              </ChangeOfficer>
            </OfficerSearchResultsRow>
          </TableBody>
        </Table>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start"
          }}
        >
          <Typography style={{ marginBottom: "32px" }} variant="body1">
            You have selected Unknown Officer. Change this officer to a known
            officer by selecting Search for Officer.
          </Typography>
          <ChangeOfficer
            caseId={props.caseId}
            dispatch={props.dispatch}
            officerSearchUrl={props.officerSearchUrl}
          >
            Search For Officer
          </ChangeOfficer>
        </div>
      )}
      <Typography variant="title" style={{ marginBottom: "16px" }}>
        Additional Info
      </Typography>
      <Card style={{ backgroundColor: "white", marginBottom: "16px" }}>
        <CardContent>
          <form>
            <div style={{ marginBottom: "24px" }}>
              <Typography style={styles.section}>Role on case</Typography>
              <Field component={OfficerTypeRadioGroup} name="roleOnCase" />
            </div>
            <Typography style={styles.section}>Notes</Typography>
            <Typography variant="body1">
              Use this section to indicate any information about the officer's
              history or risk assessment.
            </Typography>
            <Field
              component={TextField}
              name="notes"
              multiline
              style={{ width: "60%" }}
            />
          </form>
        </CardContent>
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <PrimaryButton
          data-test="officerSubmitButton"
          onClick={props.handleSubmit(onSubmit)}
        >
          {props.submitButtonText}
        </PrimaryButton>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  selectedOfficer: state.officers.selectedOfficerData
});
const ConnectedComponent = connect(mapStateToProps)(OfficerDetails);

export default reduxForm({
  form: "OfficerDetails"
})(ConnectedComponent);
