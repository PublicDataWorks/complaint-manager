import React from "react";
import { CardContent } from "@material-ui/core";
import * as _ from "lodash";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import ComplainantWitnessDisplay from "./ComplainantWitnessDisplay";
import { WITNESS } from "../../../../sharedUtilities/constants";
import ComplainantWitnessMenu from "../ComplainantWitnessMenu";

const Witnesses = props => {
  const allWitnesses = props.caseDetail.witnessCivilians.concat(
    props.caseDetail.witnessOfficers
  );

  const sortedWitnesses = _.orderBy(allWitnesses, [o => o.createdAt], ["asc"]);

  return (
    <BaseCaseDetailsCard data-test="witnessesSection" title="Witnesses">
      <CardContent style={{ padding: "0" }}>
        <ComplainantWitnessDisplay
          emptyMessage={"No witnesses have been added"}
          civiliansAndOfficers={sortedWitnesses}
          dispatch={props.dispatch}
          incidentDate={props.caseDetail.incidentDate}
        />
        {props.updateAddComplainantWitnessesToggle ? (
          <ComplainantWitnessMenu
            menuOpen={props.menuOpen}
            handleMenuOpen={props.handleMenuOpen}
            handleMenuClose={props.handleMenuClose}
            anchorEl={props.anchorEl}
            dispatch={props.dispatch}
            caseDetail={props.caseDetail}
            civilianType={WITNESS}
          />
        ) : null}
      </CardContent>
    </BaseCaseDetailsCard>
  );
};

export default Witnesses;
