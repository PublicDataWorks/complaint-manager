import React from "react";
import DateField from "../../cases/sharedFormComponents/DateField";
import moment from "moment-timezone";

const ExportDateRange = props => {
  return (
    <div>
      <DateField
        required
        name={`${props.formLabel}From`}
        label="From"
        data-testid={`${props.formLabel}FromField`}
        inputProps={{
          "data-testid": `${props.formLabel}FromInput`,
          type: "date",
          max: moment(Date.now()).format("YYYY-MM-DD")
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
          type: "date",
          max: moment(Date.now()).format("YYYY-MM-DD")
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
