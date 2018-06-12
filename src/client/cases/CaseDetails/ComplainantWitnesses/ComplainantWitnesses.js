import React from "react";
import { CardContent, Typography } from "@material-ui/core";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import WarningMessage from "../../../shared/components/WarningMessage";
import getFirstComplainant from "../../../utilities/getFirstComplainant";
import ComplainantWitnessDisplay from "./ComplainantWitnessDisplay";
import * as _ from "lodash";

const ComplainantWitnesses = props => {
  const allComplainants = props.caseDetail.complainantCivilians.concat(
    props.caseDetail.complainantOfficers
  );
  const sortedComplainants = _.orderBy(
    allComplainants,
    [o => o.createdAt],
    ["desc"]
  );

  const allWitnesses = props.caseDetail.witnessCivilians.concat(
    props.caseDetail.witnessOfficers
  );
  const sortedWitnesses = _.orderBy(allWitnesses, [o => o.createdAt], ["desc"]);

  return (
    <BaseCaseDetailsCard
      data-test="complainantWitnessesSection"
      title="Complainants & Witnesses"
      subtitle={getSubtitleText(sortedComplainants)}
    >
      <CardContent style={{ padding: "0" }}>
        <ComplainantWitnessDisplay
          title={"Complainants"}
          emptyMessage={"No complainants have been added"}
          civiliansAndOfficers={sortedComplainants}
          dispatch={props.dispatch}
        />
        <ComplainantWitnessDisplay
          title={"Witnesses"}
          emptyMessage={"No witnesses have been added"}
          civiliansAndOfficers={sortedWitnesses}
          dispatch={props.dispatch}
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

export default ComplainantWitnesses;
