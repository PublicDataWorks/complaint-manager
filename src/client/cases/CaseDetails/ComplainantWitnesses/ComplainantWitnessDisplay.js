import React from "react";
import styles from "../../../globalStyling/styles";
import { Divider, Typography } from "@material-ui/core";
import OfficerActions from "./OfficerActions";
import UnknownOfficerPanel from "../Officers/UnknownOfficerPanel";
import OfficerPanel from "../Officers/OfficerPanel";
import CivilianPanel from "./CivilianPanel";
import calculateAgeBasedOnIncidentDate from "../../../utilities/calculateAgeBasedOnIncidentDate";

const ComplainantWitnessDisplay = ({
  civiliansAndOfficers,
  emptyMessage,
  dispatch,
  incidentDate
}) => {
  return (
    <div>
      <Typography
        style={{
          ...styles.section,
          margin: "8px 24px"
        }}
      />
      {civiliansAndOfficers.length === 0 ? (
        <div>
          <Typography
            data-test="noCivilianMessage"
            style={{
              margin: "16px 24px"
            }}
          >
            {emptyMessage}
          </Typography>
          <Divider />
        </div>
      ) : (
        civiliansAndOfficers.map((civilianOrOfficer, index) => {
          if (civilianOrOfficer.hasOwnProperty("officerId")) {
            if (civilianOrOfficer.isUnknownOfficer) {
              return (
                <UnknownOfficerPanel
                  key={index}
                  caseOfficer={civilianOrOfficer}
                >
                  <OfficerActions caseOfficer={civilianOrOfficer} />
                </UnknownOfficerPanel>
              );
            } else {
              return (
                <OfficerPanel
                  key={index}
                  caseOfficer={civilianOrOfficer}
                  officerAge={calculateAgeBasedOnIncidentDate(
                    civilianOrOfficer,
                    incidentDate
                  )}
                >
                  <OfficerActions caseOfficer={civilianOrOfficer} />
                </OfficerPanel>
              );
            }
          } else {
            return (
              <CivilianPanel
                key={index}
                civilian={civilianOrOfficer}
                dispatch={dispatch}
                civilianAge={calculateAgeBasedOnIncidentDate(
                  civilianOrOfficer,
                  incidentDate
                )}
              />
            );
          }
        })
      )}
    </div>
  );
};

export default ComplainantWitnessDisplay;
