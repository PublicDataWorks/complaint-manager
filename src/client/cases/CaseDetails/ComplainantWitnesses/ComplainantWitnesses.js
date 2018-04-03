import React from "react";
import {CardContent} from "material-ui";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import ComplainantPanel from "./ComplainantPanel";
import _ from "lodash"

const ComplainantWitnesses = (props) => {
    return (
        <BaseCaseDetailsCard
            data-test="complainantWitnessesSection"
            title='Complainant & Witnesses'
        >
            <CardContent style={{padding: '0'}}>
                {
                    _.sortBy(props.caseDetail.civilians, civilian =>  [civilian.lastName, civilian.firstName]).map(civilian => (
                        <ComplainantPanel key={civilian.id} civilian={civilian} dispatch={props.dispatch}/>
                    ))
                }
            </CardContent>
        </BaseCaseDetailsCard>
    )
}

export default ComplainantWitnesses