import React from "react";
import { CardContent, Typography } from "material-ui";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import ComplainantPanel from "./ComplainantPanel";
import WarningMessage from "../../../sharedComponents/WarningMessage";
import getFirstComplainant from "../../../utilities/getFirstComplainant";
import AccusedOfficerPanel from "../Officers/OfficerPanel";
import sortComplainantOfficers from "./sortComplainantOfficers";
import UnknownOfficerPanel from "../Officers/UnknownOfficerPanel";
import OfficerActions from "./OfficerActions";

const ComplainantWitnesses = props => {
  const civiliansAndOfficers = props.caseDetail.civilians.concat(
    props.caseDetail.complainantWitnessOfficers
  );

  const officerIsKnown = caseOfficer =>
    caseOfficer.officer.fullName !== "Unknown Officer";

  return (
    <BaseCaseDetailsCard
      data-test="complainantWitnessesSection"
      title="Complainant & Witnesses"
      subtitle={getSubtitleText(civiliansAndOfficers)}
    >
      <CardContent style={{ padding: "0" }}>
        {civiliansAndOfficers.length === 0 ? (
          <Typography
            data-test="noCivilianMessage"
            style={{
              margin: "16px 24px"
            }}
          >
            No complainants or witnesses have been added
          </Typography>
        ) : (
          sortComplainantOfficers(props.caseDetail).map(civilianOrOfficer => {
            if (civilianOrOfficer.hasOwnProperty("officerId")) {
              if (officerIsKnown(civilianOrOfficer)) {
                return (
                  <AccusedOfficerPanel
                    key={civilianOrOfficer.officer.officerNumber}
                    caseOfficer={civilianOrOfficer}
                  >
                    <OfficerActions caseOfficer={civilianOrOfficer} />
                  </AccusedOfficerPanel>
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
                <ComplainantPanel
                  key={civilianOrOfficer.id}
                  civilian={civilianOrOfficer}
                  dispatch={props.dispatch}
                />
              );
            }
          })
        )}
      </CardContent>
    </BaseCaseDetailsCard>
  );
};

const getSubtitleText = complainantWitnesses => {
  const complainant = getFirstComplainant(complainantWitnesses);
  const hasComplainants = Boolean(complainant);

  if (hasComplainants) {
    return null;
  }

  return (
    <WarningMessage>
      <Typography variant={"body1"}>
        Please add at least one complainant to this case
      </Typography>
    </WarningMessage>
  );
};

export default ComplainantWitnesses;
