import React, { Fragment } from "react";
import LinkButton from "../shared/components/LinkButton";
import {
  CASE_EXPORT_TYPE,
  EXPORT_CASES_FORM_NAME
} from "../../sharedUtilities/constants";
import { openExportCasesConfirmationDialog } from "../actionCreators/exportActionCreators";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import {
  PrimaryButton,
  SecondaryButton
} from "../shared/components/StyledButtons";
import {
  Typography,
  FormControl,
  Radio,
  FormControlLabel
} from "@material-ui/core";
import ExportDateRange from "./ExportDateRange/ExportDateRange";
import { RadioGroup } from "redux-form-material-ui";
import { validateDateRangeFields } from "./ExportDateRange/validateDateRangeFields";

const formLabel = "exportCases";

const openExportCasesConfirmationDialogForDateRange = (
  values,
  openExportCasesConfirmationDialog
) => {
  validateDateRangeFields(values, formLabel);

  const dateRange = {
    exportStartDate: values[`${formLabel}From`],
    exportEndDate: values[`${formLabel}To`],
    type: values[`${formLabel}Type`]
  };

  openExportCasesConfirmationDialog(dateRange);
};

const ExportCasesTypeRadioGroup = props => (
  <FormControl>
    <RadioGroup style={{ flexDirection: "row" }} {...props}>
      <FormControlLabel
        data-test={`dateRangeTypeRadioButton.${
          CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
        }`}
        value={CASE_EXPORT_TYPE.FIRST_CONTACT_DATE}
        control={<Radio color="primary" />}
        label={"First-contacted OIPM date"}
        onClick={() =>
          props.input.onChange(CASE_EXPORT_TYPE.FIRST_CONTACT_DATE)
        }
      />
      <FormControlLabel
        data-test={`dateRangeTypeRadioButton.${CASE_EXPORT_TYPE.INCIDENT_DATE}`}
        value={CASE_EXPORT_TYPE.INCIDENT_DATE}
        control={<Radio color="primary" />}
        label="Incident Date"
        onClick={() => props.input.onChange(CASE_EXPORT_TYPE.INCIDENT_DATE)}
      />
    </RadioGroup>
  </FormControl>
);

const ExportCasesForm = props => {
  const { handleSubmit } = props;
  return (
    <div style={{ marginBottom: "36px" }}>
      <Typography variant="title">Export Cases</Typography>
      <Typography variant="body1" color="inherit">
        Select a range of <strong>first contacted dates</strong> or{" "}
        <strong>incident dates</strong> to export cases or export all cases in
        Complaint Manager.
      </Typography>
      <Field name="exportCasesType" component={ExportCasesTypeRadioGroup} />
      <ExportDateRange formLabel={formLabel} />
      <PrimaryButton
        disabled={props.buttonsDisabled}
        data-test="exportRangedCases"
        onClick={handleSubmit(values =>
          openExportCasesConfirmationDialogForDateRange(
            values,
            props.openExportCasesConfirmationDialog
          )
        )}
        style={{ marginRight: "20px" }}
      >
        Export Selected Cases
      </PrimaryButton>

      <SecondaryButton
        data-test="exportAllCases"
        disabled={props.buttonsDisabled}
        onClick={() => {
          props.openExportCasesConfirmationDialog();
        }}
      >
        Export All Cases
      </SecondaryButton>
    </div>
  );
};

const connectedForm = reduxForm({
  form: EXPORT_CASES_FORM_NAME,
  initialValues: {
    exportCasesType: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
  }
})(ExportCasesForm);

const mapStateToProps = state => ({
  buttonsDisabled: state.ui.allExports.buttonsDisabled
});

const mapDispatchToProps = {
  openExportCasesConfirmationDialog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(connectedForm);
