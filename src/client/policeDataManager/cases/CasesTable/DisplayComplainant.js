import React from "react";
import WarningMessage from "../../shared/components/WarningMessage";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export default ({ complainant }) =>
  complainant ? (
    <div>{complainantName(complainant)}</div>
  ) : (
    <WarningMessage variant="grayText">No Complainants</WarningMessage>
  );

const complainantName = ({ fullName, personType, isAnonymous }) => {
  if (personType === "Officer" && isAnonymous === true) {
    return `(AC) Officer ${fullName}`;
  } else if (personType === "Officer") {
    return `Officer ${fullName}`;
  } else if (!fullName) {
    return "Unknown";
  } else if (isAnonymous === true) {
    return `(AC) ${fullName}`;
  } else {
    return fullName;
  }
};
