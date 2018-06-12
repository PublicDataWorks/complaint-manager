import React from "react";
import { CardContent, Typography } from "@material-ui/core";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import _ from "lodash";
import AccusedOfficerPanel from "./OfficerPanel";
import UnknownOfficerPanel from "./UnknownOfficerPanel";
import ManageOfficerMenu from "./ManageOfficerMenu";
import WarningMessage from "../../../shared/components/WarningMessage";

const AccusedOfficers = ({ accusedOfficers }) => {
  return (
    <BaseCaseDetailsCard data-test="officersSection" title="Accused Officers">
      <CardContent style={{ padding: "0" }}>
        {!accusedOfficers || accusedOfficers.length === 0
          ? renderNoOfficers()
          : _.sortBy(accusedOfficers, accusedOfficer => [
              accusedOfficer.lastName,
              accusedOfficer.firstName
            ]).map(
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
      <Typography variant="body1">
        No accused officers have been added
      </Typography>
    </WarningMessage>
  </CardContent>
);

export default AccusedOfficers;
