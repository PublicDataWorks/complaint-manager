import React from "react";
import { Divider, Typography } from "@material-ui/core";
import OfficerActions from "./OfficerActions";
import UnknownOfficerPanel from "../Officers/UnknownOfficerPanel";
import OfficerPanel from "../Officers/OfficerPanel";
import InmatePanel from "./InmatePanel";
import CivilianPanel from "./CivilianPanel";
import calculateAgeBasedOnIncidentDate from "../../../utilities/calculateAgeBasedOnIncidentDate";
import { connect } from "react-redux";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";

const ComplainantWitnessDisplay = ({
  civiliansAndOfficers,
  emptyMessage,
  dispatch,
  incidentDate,
  isArchived,
  classes,
  permissions
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
                >
                  {isArchived ||
                  !permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? null : (
                    <OfficerActions caseOfficer={civilianOrOfficer} />
                  )}
                </UnknownOfficerPanel>
              );
            } else {
              return (
                <OfficerPanel
                  key={civilianOrOfficer.officerId}
                  caseOfficer={civilianOrOfficer}
                  officerAge={calculateAgeBasedOnIncidentDate(
                    civilianOrOfficer,
                    incidentDate
                  )}
                >
                  {isArchived ||
                  !permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? null : (
                    <OfficerActions caseOfficer={civilianOrOfficer} />
                  )}
                </OfficerPanel>
              );
            }
          } else if (civilianOrOfficer.hasOwnProperty("inmateId")) {
            return (
              <InmatePanel
                key={civilianOrOfficer.inmateId}
                caseInmate={civilianOrOfficer}
              ></InmatePanel>
            );
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

export default connect(state => ({
  permissions: state?.users?.current?.userInfo?.permissions
}))(ComplainantWitnessDisplay);
