import React from "react";
import WarningMessage from "../../shared/components/WarningMessage";
import { PERSON_TYPE } from "../../../../instance-files/constants";

export default ({ complainant }) =>
  complainant ? (
    <div>{complainantName(complainant)}</div>
  ) : (
    <WarningMessage variant="grayText">No Complainants</WarningMessage>
  );

const complainantName = ({ fullName, personType, isAnonymous }) => {
  if (personType === PERSON_TYPE.KNOWN_OFFICER && isAnonymous === true) {
    return `(AC) Officer ${fullName}`;
  } else if (personType === PERSON_TYPE.KNOWN_OFFICER) {
    return `Officer ${fullName}`;
  } else if (isAnonymous === true) {
    return `(AC) ${fullName}`;
  } else {
    return fullName;
  }
};
