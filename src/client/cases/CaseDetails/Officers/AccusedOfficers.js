import React from "react";
import { CardContent, Typography } from "@material-ui/core";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import AccusedOfficerPanel from "./OfficerPanel";
import UnknownOfficerPanel from "./UnknownOfficerPanel";
import ManageOfficerMenu from "./ManageOfficerMenu";
import WarningMessage from "../../../shared/components/WarningMessage";
import calculateAgeBasedOnIncidentDate from "../../../utilities/calculateAgeBasedOnIncidentDate";

const AccusedOfficers = ({ accusedOfficers, incidentDate }) => {
  return (
    <BaseCaseDetailsCard data-test="officersSection" title="Accused Officers">
      <CardContent style={{ padding: "0" }}>
        {!accusedOfficers || accusedOfficers.length === 0
          ? renderNoOfficers()
          : accusedOfficers.map(
              caseOfficer =>
                caseOfficer.isUnknownOfficer ? (
                  <UnknownOfficerPanel
                    key={caseOfficer.id}
                    caseOfficer={caseOfficer}
                  >
                    <ManageOfficerMenu caseOfficer={caseOfficer} />
                  </UnknownOfficerPanel>
                ) : (
                  <AccusedOfficerPanel
                    key={caseOfficer.id}
                    caseOfficer={caseOfficer}
                    officerAge={calculateAgeBasedOnIncidentDate(
                      caseOfficer,
                      incidentDate
                    )}
                  >
                    <ManageOfficerMenu caseOfficer={caseOfficer} />
                  </AccusedOfficerPanel>
                )
            )}
      </CardContent>
    </BaseCaseDetailsCard>
  );
};

const renderNoOfficers = () => (
  <CardContent>
    <WarningMessage>
      <Typography data-test="noAccusedOfficersMessage" variant="body1">
        No accused officers have been added
      </Typography>
    </WarningMessage>
  </CardContent>
);

export default AccusedOfficers;
