import React from "react";
import { CardContent, Typography } from "@material-ui/core";
import DetailsCard from "../../../shared/components/DetailsCard";
import WarningMessage from "../../../shared/components/WarningMessage";
import getFirstComplainant from "../../../utilities/getFirstComplainant";
import ComplainantWitnessDisplay from "./ComplainantWitnessDisplay";
import * as _ from "lodash";
import { COMPLAINANT } from "../../../../../sharedUtilities/constants";
import ComplainantWitnessMenu from "../ComplainantWitnessMenu";

const Complainants = props => {
  const allComplainants = props.caseDetails.complainantCivilians.concat(
    props.caseDetails.complainantOfficers
  );
  const { classes } = props;

  const sortedComplainants = _.orderBy(
    allComplainants,
    [o => o.createdAt],
    ["asc"]
  );

  return (
    <DetailsCard
      data-testid="complainantWitnessesSection"
      title="Complainants"
      subtitle={getSubtitleText(sortedComplainants)}
      maxWidth="850px"
    >
      <CardContent style={{ padding: "0" }}>
        <ComplainantWitnessDisplay
          emptyMessage={"No complainants have been added"}
          civiliansAndOfficers={sortedComplainants}
          dispatch={props.dispatch}
          incidentDate={props.caseDetails.incidentDate}
          isArchived={props.caseDetails.isArchived}
          classes={classes}
        />

        {props.caseDetails.isArchived ? null : (
          <ComplainantWitnessMenu
            dispatch={props.dispatch}
            caseDetails={props.caseDetails}
            civilianType={COMPLAINANT}
          />
        )}
      </CardContent>
    </DetailsCard>
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
      <Typography variant={"body2"}>
        Please add at least one complainant to this case
      </Typography>
    </WarningMessage>
  );
};

export default Complainants;
