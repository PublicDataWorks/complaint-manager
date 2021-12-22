import React from "react";
import FirstNameField from "../sharedFormComponents/FirstNameField";
import MiddleInitialField from "../sharedFormComponents/MiddleInitialField";
import LastNameField from "../sharedFormComponents/LastNameField";
import SuffixField from "../sharedFormComponents/SuffixField";
import PhoneNumberField from "../sharedFormComponents/PhoneNumberField";
import EmailField from "../sharedFormComponents/EmailField";
import { Typography } from "@material-ui/core";
import AddressInput from "../CaseDetails/CivilianDialog/AddressInput";
import AddressSecondLine from "../sharedFormComponents/AddressSecondLine";

const CivilianComplainantFields = ({ formattedAddress, formName }) => {
  return (
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
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ marginBottom: "16px", width: "100%" }}>
          <AddressInput
            name={"civilian.autoSuggestValue"}
            ariaLabel="address field"
            formName={formName}
            fieldName={"civilian.address"}
            addressLabel={"Address"}
            formattedAddress={formattedAddress}
          />
        </div>
        <AddressSecondLine
          label={"Address Line 2"}
          formName={formName}
          fieldName={"civilian.address"}
          style={{
            marginBottom: "24px",
            width: "50%"
          }}
        />
      </div>
    </div>
  );
};

export default CivilianComplainantFields;
