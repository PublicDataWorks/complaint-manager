import React from "react";
import WarningMessage from "../../shared/components/WarningMessage";
import { PERSON_TYPE } from "../../../../sharedUtilities/constants";

export default ({ complainant }) =>
  complainant ? (
    <div>{complainantName(complainant)}</div>
  ) : (
    <WarningMessage variant="grayText">No Complainants</WarningMessage>
  );

const complainantName = ({ fullName, personType }) =>
  personType === PERSON_TYPE.KNOWN_OFFICER ? `Officer ${fullName}` : fullName;
