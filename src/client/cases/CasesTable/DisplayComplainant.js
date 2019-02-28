import React from "react";
import WarningMessage from "../../shared/components/WarningMessage";

export default ({ complainant }) =>
  complainant ? (
    <div>{complainantName(complainant)}</div>
  ) : (
    <WarningMessage variant="grayText">No Complainants</WarningMessage>
  );

const complainantName = ({ fullName, officerId, isUnknownOfficer }) =>
  officerId && !isUnknownOfficer ? `Officer ${fullName}` : fullName;
