import React from "react";
import WarningMessage from "../../shared/components/WarningMessage";

const DisplayAccusedOfficer = ({ primaryAccusedOfficer }) => {
  return (
    <div data-test="primaryAccusedOfficerName">
      {primaryAccusedOfficer ? (
        primaryAccusedOfficer.fullName
      ) : (
        <WarningMessage variant="grayText">No Accused Officers</WarningMessage>
      )}
    </div>
  );
};

export default DisplayAccusedOfficer;
