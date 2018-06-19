import React from "react";
import OfficerAllegationDisplay from "./OfficerAllegationDisplay";

const OfficerAllegationsDisplay = props => {
  const { officerAllegations } = props;

  return officerAllegations.map(officerAllegation => {
    const props = {
      key: officerAllegation.id,
      rule: officerAllegation.allegation.rule || "N/A",
      paragraph: officerAllegation.allegation.paragraph || "N/A",
      directive: officerAllegation.allegation.directive || "N/A",
      details: officerAllegation.details
    };
    return <OfficerAllegationDisplay {...props} />;
  });
};

export default OfficerAllegationsDisplay;
