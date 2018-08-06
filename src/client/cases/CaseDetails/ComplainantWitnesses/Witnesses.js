import React from "react";
import { CardContent } from "@material-ui/core";
import * as _ from "lodash";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import ComplainantWitnessDisplay from "./ComplainantWitnessDisplay";

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
      </CardContent>
    </BaseCaseDetailsCard>
  );
};

export default Witnesses;
