import React from "react";
import {CardContent, Typography} from "material-ui";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import ComplainantPanel from "./ComplainantPanel";
import _ from "lodash"
import WarningMessage from "../../../sharedComponents/WarningMessage";
import getFirstComplainant from "../../../utilities/getFirstComplainant";

const ComplainantWitnesses = (props) => {

    return (
        <BaseCaseDetailsCard
            data-test="complainantWitnessesSection"
            title='Complainant & Witnesses'
            subtitle={getSubtitleText(props.caseDetail.civilians)}
        >
            <CardContent style={{padding: '0'}}>
                {
                    props.caseDetail.civilians.length === 0
                        ? <Typography
                            data-test='noCivilianMessage'
                            style={{
                                margin: '16px 24px'
                            }}
                        >
                            No complainants or witnesses have been added
                          </Typography>
                        : _.sortBy(props.caseDetail.civilians, civilian => [civilian.lastName, civilian.firstName]).map(civilian => (
                            <ComplainantPanel key={civilian.id} civilian={civilian} dispatch={props.dispatch}/>
                        ))
                }
            </CardContent>
        </BaseCaseDetailsCard>
    )
}

const getSubtitleText = (civilians) => {
    const complainant = getFirstComplainant(civilians)
    const hasComplainants = Boolean(complainant)

    if (hasComplainants) {
        return null
    }

    return (
        <WarningMessage>
            <Typography variant={'body1'}>Please add at least one complainant to this case</Typography>
        </WarningMessage>
    )
}

export default ComplainantWitnesses