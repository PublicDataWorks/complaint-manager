import React from "react";
import {CardContent} from "material-ui";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import ComplainantPanel from "./ComplainantPanel";

const ComplainantWitnesses = (props) => {
    return (
        <BaseCaseDetailsCard
            data-test="complainantWitnessesSection"
            title='Complainant & Witnesses'
        >
            <CardContent style={{padding: '0'}}>
                {
                    props.caseDetail.civilians.map(civilian => (
                        <ComplainantPanel key={civilian.id} civilian={civilian} dispatch={props.dispatch}/>
                    ))
                }
            </CardContent>
        </BaseCaseDetailsCard>
    )
}

export default ComplainantWitnesses