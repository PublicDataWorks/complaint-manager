import React from "react";
import OfficerSearchTableHeader from "../OfficerSearch/OfficerSearchTableHeader";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  Typography
} from "@material-ui/core";
import OfficerSearchResultsRow from "../OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow";
import { TextField } from "redux-form-material-ui";
import OfficerTypeRadioGroup from "./OfficerTypeRadioGroup";
import { Field, formValueSelector, reduxForm } from "redux-form";
import styles from "../../globalStyling/styles";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import { ChangeOfficer } from "../OfficerSearch/OfficerSearchResults/officerSearchResultsRowButtons";
import { connect } from "react-redux";

const OfficerDetails = props => {
  const onSubmit = (values, dispatch) => {
    const selectedOfficerId = props.selectedOfficer && props.selectedOfficer.id;
    dispatch(props.submitAction(selectedOfficerId)(values));
  };

  return (
    <div>
      <Typography variant="title">Selected Officer</Typography>
      {props.selectedOfficer ? (
        <Table style={{ marginBottom: "32px" }}>
          <OfficerSearchTableHeader />
          <TableBody>
            <OfficerSearchResultsRow officer={props.selectedOfficer}>
              <ChangeOfficer
                data-test="knownOfficerChangeOfficerLink"
                caseId={props.caseId}
                dispatch={props.dispatch}
                officerSearchUrl={`${props.officerSearchUrl}?role=${
                  props.roleOnCase
                }`}
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
            data-test="unknownOfficerChangeOfficerLink"
            caseId={props.caseId}
            dispatch={props.dispatch}
            officerSearchUrl={`${props.officerSearchUrl}?role=${
              props.roleOnCase
            }`}
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
              Use this section to add notes, a description, or indicate any
              information about the officer’s history or risk assessment.
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

const mapStateToProps = state => {
  const selector = formValueSelector("OfficerDetails");

  return {
    selectedOfficer: state.officers.selectedOfficerData,
    roleOnCase: selector(state, "roleOnCase")
  };
};
const ConnectedComponent = connect(mapStateToProps)(OfficerDetails);

export default reduxForm({
  form: "OfficerDetails"
})(ConnectedComponent);
