import React from "react";
import {CardContent, Typography} from "material-ui";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import _ from "lodash"
import OfficerPanel from "./OfficerPanel";

const Officers = (props) => {

    const officers = props.caseDetail.officers

    return (
        <BaseCaseDetailsCard
            data-test="officersSection"
            title='Accused Officers'
        >
            <CardContent style={{padding: '0'}}>
                {
                    !officers || officers.length === 0 ? renderNoOfficers() : (

                        _.sortBy(officers, officer => [officer.lastName, officer.firstName])
                            .map(officer => (
                                <OfficerPanel key={officer.officerNumber} officer={officer}/>
                            ))
                    )
                }
            </CardContent>
        </BaseCaseDetailsCard>
    )
}

const renderNoOfficers = () => (
    <CardContent>
        <Typography>
            No accused officers have been added
        </Typography>
    </CardContent>
)

export default Officers