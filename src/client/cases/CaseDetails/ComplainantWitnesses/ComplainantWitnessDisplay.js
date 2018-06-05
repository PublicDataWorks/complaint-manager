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
            if (civilianOrOfficer.isUnknownOfficer) {
              return (
                <UnknownOfficerPanel
                  key={civilianOrOfficer.id}
                  caseOfficer={civilianOrOfficer}
                >
                  <OfficerActions caseOfficer={civilianOrOfficer} />
                </UnknownOfficerPanel>
              );
            } else {
              return (
                <OfficerPanel
                  key={civilianOrOfficer.id}
                  caseOfficer={civilianOrOfficer}
                >
                  <OfficerActions caseOfficer={civilianOrOfficer} />
                </OfficerPanel>
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
