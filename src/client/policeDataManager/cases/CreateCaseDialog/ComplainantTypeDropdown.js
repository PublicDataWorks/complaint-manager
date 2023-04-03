import React from "react";
import { FormControl, FormLabel, Typography } from "@material-ui/core";
import Dropdown from "../../../common/components/Dropdown";
import { connect } from "react-redux";

const isOfficer = type => type.employeeDescription === "Officer";

const ComplainantTypeDropdown = props => {
  let officerAdded = false;
  return (
    <FormControl style={{ width: "90%", marginBottom: "15px" }}>
      {props.showLabels ? (
        <>
          <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
            Complainant Information
          </Typography>
          <FormLabel>The complainant is a...</FormLabel>
        </>
      ) : (
        ""
      )}
      <Dropdown
        required
        inputProps={{ "data-testid": "complainant-type-dropdown" }}
        input={props.input}
        meta={props.meta}
        style={{ width: "100%" }}
        placeholder="Select a Person Type"
      >
        {props.personTypes.reduce((acc, type) => {
          if (isOfficer(type)) {
            if (officerAdded) {
              return acc;
            } else {
              officerAdded = true;
            }
          }

          acc.push({
            label: isOfficer(type) ? "Police Officer" : type.description,
            value: type.key
          });

          return acc;
        }, [])}
      </Dropdown>
    </FormControl>
  );
};

export default connect(state => ({ personTypes: state.personTypes }))(
  ComplainantTypeDropdown
);
