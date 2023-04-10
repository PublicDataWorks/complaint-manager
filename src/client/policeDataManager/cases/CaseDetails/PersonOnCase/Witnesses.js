import React from "react";
import { CardContent } from "@material-ui/core";
import * as _ from "lodash";
import DetailsCard from "../../../shared/components/DetailsCard";
import OfficerActions from "./OfficerActions";
import PersonOnCaseDisplay from "./PersonOnCaseDisplay";
import { WITNESS } from "../../../../../sharedUtilities/constants";
import PersonOnCaseMenu from "../PersonOnCaseMenu";

const Witnesses = props => {
  const allWitnesses = props.caseDetails.witnessCivilians
    .concat(props.caseDetails.witnessOfficers)
    .concat(props.caseDetails.witnessInmates || []);

  const { classes } = props;

  const sortedWitnesses = _.orderBy(allWitnesses, [o => o.createdAt], ["asc"]);

  return (
    <DetailsCard
      data-testid="witnessesSection"
      title="Witnesses"
      maxWidth="850px"
    >
      <CardContent style={{ padding: "0" }}>
        <PersonOnCaseDisplay
          emptyMessage={"No witnesses have been added"}
          civiliansAndOfficers={sortedWitnesses}
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
            civilianType={WITNESS}
          />
        )}
      </CardContent>
    </DetailsCard>
  );
};

export default Witnesses;
