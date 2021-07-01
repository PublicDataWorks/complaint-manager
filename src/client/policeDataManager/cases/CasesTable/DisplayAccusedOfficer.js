import React from "react";
import WarningMessage from "../../shared/components/WarningMessage";

const DisplayAccusedOfficer = ({ accusedOfficers }) => {
  return (
    <div data-testid="accusedOfficerName">
      {accusedOfficers && accusedOfficers.length ? (
        accusedOfficers.map(officer => officer.fullName).join(", ")
      ) : (
        <WarningMessage variant="grayText">No Accused</WarningMessage>
      )}
    </div>
  );
};

export default DisplayAccusedOfficer;
