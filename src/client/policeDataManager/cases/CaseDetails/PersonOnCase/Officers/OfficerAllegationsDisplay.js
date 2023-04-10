import React from "react";
import OfficerAllegationDisplay from "./OfficerAllegationDisplay";

const OfficerAllegationsDisplay = props => {
  const { officerAllegations, officerId } = props;

  return officerAllegations.map(officerAllegation => {
    const props = {
      key: officerAllegation.id,
      rule: officerAllegation.allegation.rule || "N/A",
      paragraph: officerAllegation.allegation.paragraph || "N/A",
      directive: officerAllegation.allegation.directive || "N/A",
      details: officerAllegation.details,
      severity: officerAllegation.severity
    };
    return <OfficerAllegationDisplay officerId={officerId} {...props} />;
  });
};

export default OfficerAllegationsDisplay;
