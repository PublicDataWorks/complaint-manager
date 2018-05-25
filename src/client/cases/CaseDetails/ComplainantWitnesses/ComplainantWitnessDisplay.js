import React from "react";
import styles from "../../../globalStyling/styles";
import { Divider, Typography } from "material-ui";
import OfficerActions from "./OfficerActions";
import UnknownOfficerPanel from "../Officers/UnknownOfficerPanel";
import OfficerPanel from "../Officers/OfficerPanel";
import CivilianPanel from "./CivilianPanel";

const ComplainantWitnessDisplay = ({
  civiliansAndOfficers,
  title,
  emptyMessage,
  dispatch
}) => {
  const officerIsKnown = caseOfficer =>
    caseOfficer.officer.fullName !== "Unknown Officer";

  return (
    <div>
      <Typography
        style={{
          ...styles.section,
          margin: "8px 24px"
        }}
      >
        {title}
      </Typography>
      <Divider />
      {civiliansAndOfficers.length === 0 ? (
        <Typography
          data-test="noCivilianMessage"
          style={{
            margin: "16px 24px"
          }}
        >
          {emptyMessage}
        </Typography>
      ) : (
        civiliansAndOfficers.map(civilianOrOfficer => {
          if (civilianOrOfficer.hasOwnProperty("officerId")) {
            if (officerIsKnown(civilianOrOfficer)) {
              return (
                <OfficerPanel
                  key={civilianOrOfficer.officer.officerNumber}
                  caseOfficer={civilianOrOfficer}
                >
                  <OfficerActions caseOfficer={civilianOrOfficer} />
                </OfficerPanel>
              );
            } else {
              return (
                <UnknownOfficerPanel
                  key={civilianOrOfficer.id}
                  caseOfficer={civilianOrOfficer}
                >
                  <OfficerActions caseOfficer={civilianOrOfficer} />
                </UnknownOfficerPanel>
              );
            }
          } else {
            return (
              <CivilianPanel
                key={civilianOrOfficer.id}
                civilian={civilianOrOfficer}
                dispatch={dispatch}
              />
            );
          }
        })
      )}
    </div>
  );
};

export default ComplainantWitnessDisplay;
