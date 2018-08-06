import React from "react";
import { CardContent, Typography } from "@material-ui/core";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import WarningMessage from "../../../shared/components/WarningMessage";
import getFirstComplainant from "../../../utilities/getFirstComplainant";
import ComplainantWitnessDisplay from "./ComplainantWitnessDisplay";
import * as _ from "lodash";

const Complainants = props => {
  const allComplainants = props.caseDetail.complainantCivilians.concat(
    props.caseDetail.complainantOfficers
  );
  const sortedComplainants = _.orderBy(
    allComplainants,
    [o => o.createdAt],
    ["asc"]
  );

  return (
    <BaseCaseDetailsCard
      data-test="complainantWitnessesSection"
      title="Complainants"
      subtitle={getSubtitleText(sortedComplainants)}
    >
      <CardContent style={{ padding: "0" }}>
        <ComplainantWitnessDisplay
          emptyMessage={"No complainants have been added"}
          civiliansAndOfficers={sortedComplainants}
          dispatch={props.dispatch}
          incidentDate={props.caseDetail.incidentDate}
        />
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

export default Complainants;