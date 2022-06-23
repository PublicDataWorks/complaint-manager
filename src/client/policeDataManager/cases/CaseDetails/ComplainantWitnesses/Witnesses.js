import React from "react";
import { CardContent } from "@material-ui/core";
import * as _ from "lodash";
import DetailsCard from "../../../shared/components/DetailsCard";
import ComplainantWitnessDisplay from "./ComplainantWitnessDisplay";
import { WITNESS } from "../../../../../sharedUtilities/constants";
import ComplainantWitnessMenu from "../ComplainantWitnessMenu";

const Witnesses = props => {
  const allWitnesses = props.caseDetails.witnessCivilians.concat(
    props.caseDetails.witnessOfficers
  );

  const { classes } = props;

  const sortedWitnesses = _.orderBy(allWitnesses, [o => o.createdAt], ["asc"]);

  return (
    <DetailsCard data-testid="witnessesSection" title="Witnesses">
      <CardContent style={{ padding: "0" }}>
        <ComplainantWitnessDisplay
          emptyMessage={"No witnesses have been added"}
          civiliansAndOfficers={sortedWitnesses}
          dispatch={props.dispatch}
          incidentDate={props.caseDetails.incidentDate}
          isArchived={props.caseDetails.isArchived}
          classes={classes}
        />
        {props.caseDetails.isArchived ? null : (
          <ComplainantWitnessMenu
            menuOpen={props.menuOpen}
            handleMenuOpen={props.handleMenuOpen}
            handleMenuClose={props.handleMenuClose}
            anchorEl={props.anchorEl}
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
