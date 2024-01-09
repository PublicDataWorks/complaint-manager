import React from "react";
import { AccordionDetails } from "@material-ui/core";
import OfficerInfoDisplay from "../cases/CaseDetails/PersonOnCase/Officers/OfficerInfoDisplay";

const OfficerAllegationExpansionPanel = ({
  details,
  severity,
  ruleChapter,
  directive,
  customDirective
}) => {
  return (
    <div>
      <AccordionDetails>
        <OfficerInfoDisplay
          shouldTruncate={false}
          displayLabel="To Wit Chapter"
          value={ruleChapter?.name}
          style={{
            marginRight: "32px",
            marginLeft: "64px"
          }}
        />
      </AccordionDetails>
      <AccordionDetails>
        <OfficerInfoDisplay
          shouldTruncate={false}
          displayLabel="Directive"
          value={directive ? directive.name : customDirective}
          style={{
            marginRight: "32px",
            marginLeft: "64px"
          }}
        />
      </AccordionDetails>
      <AccordionDetails>
        <OfficerInfoDisplay
          shouldTruncate={false}
          displayLabel="Severity"
          value={severity}
          style={{
            marginRight: "32px",
            marginLeft: "64px"
          }}
        />
      </AccordionDetails>
      <AccordionDetails>
        <OfficerInfoDisplay
          shouldTruncate={false}
          displayLabel="Allegation Details"
          value={details}
          style={{
            marginRight: "32px",
            marginLeft: "64px"
          }}
        />
      </AccordionDetails>
    </div>
  );
};

export default OfficerAllegationExpansionPanel;
