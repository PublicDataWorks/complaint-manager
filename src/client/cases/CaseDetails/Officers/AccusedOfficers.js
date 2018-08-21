import React, { Fragment } from "react";
import { CardContent, Typography, Divider } from "@material-ui/core";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import AccusedOfficerPanel from "./OfficerPanel";
import UnknownOfficerPanel from "./UnknownOfficerPanel";
import ManageOfficerMenu from "./ManageOfficerMenu";
import WarningMessage from "../../../shared/components/WarningMessage";
import calculateAgeBasedOnIncidentDate from "../../../utilities/calculateAgeBasedOnIncidentDate";
import LinkButton from "../../../shared/components/LinkButton";
import { push } from "react-router-redux";
import { initialize } from "redux-form";
import { ACCUSED } from "../../../../sharedUtilities/constants";

const AccusedOfficers = ({
  dispatch,
  accusedOfficers,
  incidentDate,
  caseId
}) => {
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
        <LinkButton
          style={{
            marginLeft: "8px",
            marginTop: "8px",
            marginBottom: "8px"
          }}
          onClick={() => {
            dispatch(
              initialize("OfficerDetails", {
                roleOnCase: ACCUSED
              })
            );
            dispatch(push(`/cases/${caseId}/officers/search`));
          }}
          data-test="addAccusedOfficerButton"
        >
          + Add Officer
        </LinkButton>
      </CardContent>
    </BaseCaseDetailsCard>
  );
};

const renderNoOfficers = () => (
  <Fragment>
    <CardContent>
      <WarningMessage>
        <Typography data-test="noAccusedOfficersMessage" variant="body1">
          No accused officers have been added
        </Typography>
      </WarningMessage>
    </CardContent>
    <Divider />
  </Fragment>
);

export default AccusedOfficers;
