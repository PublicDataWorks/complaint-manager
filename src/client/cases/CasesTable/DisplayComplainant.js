import React from "react";
import getFirstComplainant from "../../utilities/getFirstComplainant";
import formatCivilianName from "../../utilities/formatCivilianName";
import WarningMessage from "../../shared/components/WarningMessage";

const DisplayComplainant = ({ caseDetails }) => {
  const { complainantOfficers = [], complainantCivilians = [] } = caseDetails;

  const civilianComplainant = getFirstComplainant(complainantCivilians);
  const officerComplainant = getFirstComplainant(complainantOfficers);

  let formattedComplainant;

  if (Boolean(civilianComplainant)) {
    formattedComplainant = formatCivilianName(civilianComplainant);
  } else if (Boolean(officerComplainant)) {
    if (officerComplainant.fullName !== "Unknown Officer") {
      formattedComplainant = `Officer ${officerComplainant.fullName}`;
    } else {
      formattedComplainant = officerComplainant.fullName;
    }
  } else {
    formattedComplainant = "";
  }

  return formattedComplainant ? (
    <div>{formattedComplainant}</div>
  ) : (
    <WarningMessage variant="tableCell">No Complainants</WarningMessage>
  );
};

export default DisplayComplainant;
