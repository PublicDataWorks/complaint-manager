import React from "react";
import { FormControl, FormLabel, Typography } from "@material-ui/core";
import Dropdown from "../../../common/components/Dropdown";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

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
        inputProps={{ "data-testid": "complainant-type-dropdown" }}
        input={props.input}
        meta={props.meta}
        style={{ width: "100%" }}
        placeholder="Select a Person Type"
      >
        {generateMenuOptions(
          Object.keys(PERSON_TYPE).reduce((acc, key) => {
            let type = PERSON_TYPE[key];
            if (isOfficer(type)) {
              if (officerAdded) {
                return acc;
              } else {
                officerAdded = true;
              }
            }
            acc.push([
              isOfficer(type) ? "Police Officer" : type.description,
              key
            ]);
            return acc;
          }, [])
        )}
      </Dropdown>
    </FormControl>
  );
};

export default ComplainantTypeDropdown;
