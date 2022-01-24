import React from "react";
import DateField from "../../cases/sharedFormComponents/DateField";
import moment from "moment-timezone";
import { ISO_DATE } from "../../../../sharedUtilities/constants";

const ExportDateRange = props => {
  return (
    <div>
      <DateField
        required
        aria-label="From Date Field"
        name={`${props.formLabel}From`}
        label="From"
        data-testid={`${props.formLabel}FromField`}
        inputProps={{
          "data-testid": `${props.formLabel}FromInput`,
          "aria-label": "Date Field",
          type: "date",
          max: moment(Date.now()).format(ISO_DATE)
        }}
        clearable={true}
        style={{
          minWidth: "140px",
          marginRight: "5%",
          marginBottom: "3%"
        }}
      />
      <DateField
        required
        name={`${props.formLabel}To`}
        label="To"
        data-testid={`${props.formLabel}ToField`}
        inputProps={{
          "data-testid": `${props.formLabel}ToInput`,
          "aria-label": "Date Field",
          type: "date",
          max: moment(Date.now()).format(ISO_DATE)
        }}
        clearable={true}
        style={{
          minWidth: "140px",
          marginRight: "5%",
          marginBottom: "3%"
        }}
      />
    </div>
  );
};

export default ExportDateRange;
