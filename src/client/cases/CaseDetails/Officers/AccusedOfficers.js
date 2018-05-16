import React from "react";
import { CardContent, Typography } from "material-ui";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import _ from "lodash";
import AccusedOfficerPanel from "./OfficerPanel";
import UnknownOfficerPanel from "./UnknownOfficerPanel";
import ManageOfficerMenu from "./ManageOfficerMenu";

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
                  <AccusedOfficerPanel
                    key={caseOfficer.officer.officerNumber}
                    caseOfficer={caseOfficer}
                  >
                    <ManageOfficerMenu caseOfficer={caseOfficer} />
                  </AccusedOfficerPanel>
                ) : (
                  <UnknownOfficerPanel
                    key={caseOfficer.id}
                    caseOfficer={caseOfficer}
                  >
                    <ManageOfficerMenu caseOfficer={caseOfficer} />
                  </UnknownOfficerPanel>
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
