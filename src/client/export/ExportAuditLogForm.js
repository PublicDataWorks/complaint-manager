import React from "react";
import { reduxForm } from "redux-form";
import {
  EXPORT_AUDIT_LOG_FORM_NAME,
  USER_PERMISSIONS
} from "../../sharedUtilities/constants";
import { Typography } from "@material-ui/core";
import {
  PrimaryButton,
  SecondaryButton
} from "../shared/components/StyledButtons";
import { connect } from "react-redux";
import { openExportAuditLogConfirmationDialog } from "../actionCreators/exportActionCreators";
import LinkButton from "../shared/components/LinkButton";
import ExportDateRange from "./ExportDateRange/ExportDateRange";
import { validateDateRangeFields } from "./ExportDateRange/validateDateRangeFields";

const formLabel = "exportAuditLog";

const openExportAuditLogConfirmationDialogForDateRange = (
  values,
  openExportAuditLogConfirmationDialog
) => {
  validateDateRangeFields(values, formLabel);
  const dateRange =
    values && values[`${formLabel}From`] && values[`${formLabel}To`]
      ? {
          exportStartDate: values[`${formLabel}From`],
          exportEndDate: values[`${formLabel}To`]
        }
      : null;

  openExportAuditLogConfirmationDialog(dateRange);
};

const ExportAuditLogForm = props => {
  if (
    !props.permissions ||
    !props.permissions.includes(USER_PERMISSIONS.EXPORT_AUDIT_LOG)
  ) {
    return null;
  }
  if (!props.dateRangeExportFeature) {
    return (
      <LinkButton
        data-test="exportAllAudits"
        disabled={props.buttonsDisabled}
        onClick={() => {
          props.openExportAuditLogConfirmationDialog();
        }}
      >
        Export Audit Log
      </LinkButton>
    );
  } else {
    const { handleSubmit } = props;
    return (
      <div>
        <div style={{ margin: "0 0 32px 0" }}>
          <Typography variant="title" style={{ marginRight: "20px" }}>
            Export Audit Log
          </Typography>
          <Typography variant="body1" color="inherit">
            Select a date range to export an audit log of Complaint Manager
            activities within range or export a full audit log.
          </Typography>
        </div>
        <ExportDateRange formLabel={formLabel} />
        <PrimaryButton
          disabled={props.buttonsDisabled}
          data-test="exportRangedAudits"
          onClick={handleSubmit(values =>
            openExportAuditLogConfirmationDialogForDateRange(
              values,
              props.openExportAuditLogConfirmationDialog
            )
          )}
          style={{ marginRight: "20px" }}
        >
          Export Selected Audit Log
        </PrimaryButton>
        <SecondaryButton
          data-test="exportAllAudits"
          disabled={props.buttonsDisabled}
          onClick={() => {
            props.openExportAuditLogConfirmationDialog();
          }}
        >
          Export Full Audit Log
        </SecondaryButton>
      </div>
    );
  }
};

const connectedForm = reduxForm({
  form: EXPORT_AUDIT_LOG_FORM_NAME
})(ExportAuditLogForm);

const mapStateToProps = state => ({
  dateRangeExportFeature: state.featureToggles.dateRangeExportFeature,
  permissions: state.users.current.userInfo.permissions,
  buttonsDisabled: state.ui.allExports.buttonsDisabled
});

const mapDispatchToProps = {
  openExportAuditLogConfirmationDialog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(connectedForm);
