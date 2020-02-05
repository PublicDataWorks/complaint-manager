import React from "react";
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
  incidentDate,
  isArchived,
  classes,
  contactInformationFeature
}) => {
  return (
    <div>
      {civiliansAndOfficers.length === 0 ? (
        <div>
          <Typography
            data-testid="noCivilianMessage"
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
                  contactInformationFeature={contactInformationFeature}
                >
                  {isArchived ? null : (
                    <OfficerActions caseOfficer={civilianOrOfficer} />
                  )}
                </UnknownOfficerPanel>
              );
            } else {
              return (
                <OfficerPanel
                  key={index}
                  caseOfficer={civilianOrOfficer}
                  contactInformationFeature={contactInformationFeature}
                  officerAge={calculateAgeBasedOnIncidentDate(
                    civilianOrOfficer,
                    incidentDate
                  )}
                >
                  {isArchived ? null : (
                    <OfficerActions caseOfficer={civilianOrOfficer} />
                  )}
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
                isArchived={isArchived}
                classes={classes}
              />
            );
          }
        })
      )}
    </div>
  );
};

export default ComplainantWitnessDisplay;
