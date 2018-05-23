import React from "react";
import WarningMessage from "../../shared/components/WarningMessage";

const DisplayAccusedOfficer = ({ accusedOfficers }) => {
  return (
    <div data-test="accusedOfficerName">
      {accusedOfficers &&
      accusedOfficers.length > 0 &&
      accusedOfficers[0].officer ? (
        accusedOfficers[0].officer.fullName
      ) : (
        <WarningMessage variant="tableCell">No Accused Officers</WarningMessage>
      )}
    </div>
  );
};

export default DisplayAccusedOfficer;
