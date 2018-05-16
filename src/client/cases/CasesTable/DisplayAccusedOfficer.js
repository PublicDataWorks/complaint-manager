import React from "react";

const DisplayAccusedOfficer = ({ accusedOfficers }) => {
  return (
    <div data-test="accusedOfficerName">
      {accusedOfficers &&
      accusedOfficers.length > 0 &&
      accusedOfficers[0].officer
        ? accusedOfficers[0].officer.fullName
        : null}
    </div>
  );
};

export default DisplayAccusedOfficer;
