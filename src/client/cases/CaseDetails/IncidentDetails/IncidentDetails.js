import React from 'react'
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import {CardContent} from "material-ui";
import CivilianInfoDisplay from "../ComplainantWitnesses/CivilianInfoDisplay";
import formatDate from "../../../utilities/formatDate";

const IncidentDetails = ({firstContactDate, incidentDate, incidentTime}) => {
    return (
        <BaseCaseDetailsCard
            title='Case Details'
        >
            <CardContent
                style={{
                    padding: '16px'
                }}
            >
                <div style={{display: 'flex', width: '100%', paddingRight: 0}}>
                    <CivilianInfoDisplay
                        displayLabel='First Contact Date'
                        value={formatDate(firstContactDate)}
                        testLabel="firstContactDate"
                    />
                    <CivilianInfoDisplay
                        displayLabel='Incident Date'
                        value={formatDate(incidentDate)}
                        testLabel="incidentDate"
                    />
                    <CivilianInfoDisplay
                        displayLabel='Incident Time'
                        value={incidentTime}
                        testLabel="incidentTime"
                    />
                </div>
            </CardContent>
        </BaseCaseDetailsCard>
    )
}

export default IncidentDetails