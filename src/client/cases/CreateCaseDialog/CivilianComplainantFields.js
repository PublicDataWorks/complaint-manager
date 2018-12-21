import React from "react";
import FirstNameField from "../sharedFormComponents/FirstNameField";
import MiddleInitialField from "../sharedFormComponents/MiddleInitialField";
import LastNameField from "../sharedFormComponents/LastNameField";
import SuffixField from "../sharedFormComponents/SuffixField";
import PhoneNumberField from "../sharedFormComponents/PhoneNumberField";
import EmailField from "../sharedFormComponents/EmailField";
import { Typography } from "@material-ui/core";

const CivilianComplainantFields = () => (
  <div>
    <FirstNameField name="civilian.firstName" />
    <MiddleInitialField
      name="civilian.middleInitial"
      style={{
        width: "40px",
        marginRight: "5%"
      }}
    />
    <LastNameField name="civilian.lastName" />
    <SuffixField
      name="civilian.suffix"
      style={{
        width: "120px"
      }}
    />
    <br />
    <div style={{ display: "flex" }}>
      <PhoneNumberField name={"civilian.phoneNumber"} />
      <Typography
        variant="button"
        style={{
          marginLeft: "22px",
          marginTop: "22px",
          marginRight: "22px"
        }}
      >
        OR
      </Typography>
      <EmailField name={"civilian.email"} autoComplete="disabled" />
    </div>
  </div>
);

export default CivilianComplainantFields;
