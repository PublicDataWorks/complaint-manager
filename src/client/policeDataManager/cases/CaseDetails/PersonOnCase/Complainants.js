import React from "react";
import { CardContent, Typography } from "@material-ui/core";
import DetailsCard from "../../../shared/components/DetailsCard";
import WarningMessage from "../../../shared/components/WarningMessage";
import getFirstComplainant from "../../../utilities/getFirstComplainant";
import PersonOnCaseDisplay from "./PersonOnCaseDisplay";
import OfficerActions from "./OfficerActions";
import * as _ from "lodash";
import { COMPLAINANT } from "../../../../../sharedUtilities/constants";
import PersonOnCaseMenu from "../PersonOnCaseMenu";

const Complainants = props => {
  const allComplainants = props.caseDetails.complainantCivilians
    .concat(props.caseDetails.complainantOfficers || [])
    .concat(props.caseDetails.complainantInmates || []);
  const { classes } = props;

  const sortedComplainants = _.orderBy(
    allComplainants,
    [o => o.createdAt],
    ["asc"]
  );

  return (
    <DetailsCard
      data-testid="personOnCaseesSection"
      title="Complainants"
      subtitle={getSubtitleText(sortedComplainants)}
      maxWidth="850px"
    >
      <CardContent style={{ padding: "0" }}>
        <PersonOnCaseDisplay
          emptyMessage={"No complainants have been added"}
          civiliansAndOfficers={sortedComplainants}
          dispatch={props.dispatch}
          incidentDate={props.caseDetails.incidentDate}
          isArchived={props.caseDetails.isArchived}
          classes={classes}
          OfficerButtonsComponent={OfficerActions}
        />

        {props.caseDetails.isArchived ? null : (
          <PersonOnCaseMenu
            dispatch={props.dispatch}
            caseDetails={props.caseDetails}
            civilianType={COMPLAINANT}
          />
        )}
      </CardContent>
    </DetailsCard>
  );
};

const getSubtitleText = personOnCasees => {
  const complainant = getFirstComplainant(personOnCasees);
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
