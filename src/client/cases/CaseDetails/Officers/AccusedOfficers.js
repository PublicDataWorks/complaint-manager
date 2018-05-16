import React from "react";
import { CardContent, Typography } from "material-ui";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import _ from "lodash";
import OfficerPanel from "./OfficerPanel";
import UnknownOfficerPanel from "./UnknownOfficerPanel";

const AccusedOfficers = ({ accusedOfficers }) => {
  const officerIsKnown = caseOfficer =>
    caseOfficer.officer.fullName !== "Unknown Officer";

  return (
    <BaseCaseDetailsCard data-test="officersSection" title="Accused Officers">
      <CardContent style={{ padding: "0" }}>
        {!accusedOfficers || accusedOfficers.length === 0
          ? renderNoOfficers()
          : _.sortBy(accusedOfficers, accusedOfficer => [
              accusedOfficer.officer.lastName,
              accusedOfficer.officer.firstName
            ]).map(
              caseOfficer =>
                officerIsKnown(caseOfficer) ? (
                  <OfficerPanel
                    key={caseOfficer.officer.officerNumber}
                    caseOfficer={caseOfficer}
                  />
                ) : (
                  <UnknownOfficerPanel
                    key={caseOfficer.id}
                    caseOfficer={caseOfficer}
                  />
                )
            )}
      </CardContent>
    </BaseCaseDetailsCard>
  );
};

const renderNoOfficers = () => (
  <CardContent>
    <Typography>No accused officers have been added</Typography>
  </CardContent>
);

export default AccusedOfficers;
