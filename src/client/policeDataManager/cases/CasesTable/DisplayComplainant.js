import React from "react";
import WarningMessage from "../../shared/components/WarningMessage";

export default ({ complainant }) =>
  complainant ? (
    <div>{complainantName(complainant)}</div>
  ) : (
    <WarningMessage variant="grayText">No Complainants</WarningMessage>
  );

const complainantName = ({ fullName, personType, isAnonymous }) => {
  if (personType === "Officer" && isAnonymous === true) {
    return `(ANON) Officer ${fullName}`;
  } else if (personType === "Officer") {
    return `Officer ${fullName}`;
  } else if (!fullName) {
    return "Unknown";
  } else if (isAnonymous === true) {
    return `(ANON) ${fullName}`;
  } else {
    return fullName;
  }
};
