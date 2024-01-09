import React from "react";
import OfficerAllegationDisplay from "./OfficerAllegationDisplay";

const OfficerAllegationsDisplay = props => {
  const { officerAllegations, officerId } = props;

  return officerAllegations.map(officerAllegation => {
    const props = {
      key: officerAllegation.id,
      rule: officerAllegation.allegation.rule || "N/A",
      paragraph: officerAllegation.allegation.paragraph || "N/A",
      directive: officerAllegation.directive,
      customDirective: officerAllegation.customDirective,
      details: officerAllegation.details,
      severity: officerAllegation.severity,
      ruleChapter: officerAllegation.ruleChapter
    };
    return <OfficerAllegationDisplay officerId={officerId} {...props} />;
  });
};

export default OfficerAllegationsDisplay;
