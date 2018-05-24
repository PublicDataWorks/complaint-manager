import React from "react";
import FirstNameField from "../sharedFormComponents/FirstNameField";
import MiddleInitialField from "../sharedFormComponents/MiddleInitialField";
import LastNameField from "../sharedFormComponents/LastNameField";
import SuffixField from "../sharedFormComponents/SuffixField";
import PhoneNumberField from "../sharedFormComponents/PhoneNumberField";
import EmailField from "../sharedFormComponents/EmailField";

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
    <PhoneNumberField name={"civilian.phoneNumber"} />
    <EmailField name={"civilian.email"} />
  </div>
);

export default CivilianComplainantFields;
