import React from "react";
import { Typography } from "@material-ui/core";
import styles from "../../../globalStyling/styles";
import { TextField } from "redux-form-material-ui";
import { Field } from "redux-form";

const OfficerHistoryTabContent = props => {
  const { officer, caseOfficerName, caseOfficerId, isSelectedOfficer } = props;
  const displayValue = isSelectedOfficer ? "block" : "none";
  return (
    <div
      style={{ padding: "24px", display: displayValue }}
      key={caseOfficerId}
      data-test={`tab-content-${caseOfficerId}`}
    >
      <Typography
        variant="title"
        style={{ paddingBottom: "16px", ...styles.section }}
      >
        {caseOfficerName}
      </Typography>
      <Typography style={{ paddingBottom: "16px" }}>
        The IPM has reviewed this officer’s disciplinary history for the last
        five years and has determined that the subject employee has the
        following significant/noteworthy number of complaints.
      </Typography>
      <Typography>
        Please enter the number of allegations this officer has received over
        the past 5 years
      </Typography>
      <Field
        name={`${officer}.numberHistoricalHighAllegations`}
        component={TextField}
        label="High Level"
      />
    </div>
  );
};

export default OfficerHistoryTabContent;
