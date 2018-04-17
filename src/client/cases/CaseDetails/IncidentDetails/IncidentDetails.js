import React from 'react'
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import {CardContent} from "material-ui";
import CivilianInfoDisplay from "../ComplainantWitnesses/CivilianInfoDisplay";
import formatDate, {computeTimeZone, format12HourTime} from "../../../utilities/formatDate";
import LinkButton from "../../../sharedComponents/LinkButton";
import IncidentDetailsDialog from "./IncidentDetailsDialog";
import AddressInfoDisplay from "../../../sharedComponents/AddressInfoDisplay";

class IncidentDetails extends React.Component {

    state = {
        dialogOpen: false
    }

    formatTimeForDisplay = (date, time) => {
        if (!time) return time
        return format12HourTime(time) + " " + computeTimeZone(date, time)
    }

    handleDialogOpen = () => {
        this.setState({dialogOpen: true})
    }

    handleDialogClose = () => {
        this.setState({dialogOpen: false})
    }

    render() {
        const {firstContactDate, incidentDate, incidentTime, caseId, incidentLocation, district} = this.props

        return (
            <BaseCaseDetailsCard
                title='Incident Details'
            >
                <CardContent
                    style={{
                        padding: '16px'
                    }}
                >
                    <div style={{display: 'flex', width: '100%', paddingRight: 0, marginBottom: '26px'}}>
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
                            value={this.formatTimeForDisplay(incidentDate, incidentTime)}
                            testLabel="incidentTime"
                        />
                        <div>
                            <LinkButton
                                data-test="editIncidentDetailsButton"
                                onClick={this.handleDialogOpen}
                            >
                                Edit
                            </LinkButton>
                        </div>
                    </div>
                    <div style={{display: 'flex', width: '100%', paddingRight: 0}}>
                        <AddressInfoDisplay
                            testLabel="incidentLocation"
                            displayLabel='Incident Location'
                            address={incidentLocation}
                            style={{flex:2}}
                        />
                        <CivilianInfoDisplay
                            displayLabel='District'
                            value={district}
                            testLabel="incidentDistrict"
                        />
                       <div style={{width: '88px'}}/>
                    </div>
                </CardContent>
                <IncidentDetailsDialog
                    initialValues={{
                        firstContactDate,
                        incidentDate,
                        incidentTime,
                        incidentLocation
                    }}
                    dialogOpen={this.state.dialogOpen}
                    handleDialogClose={this.handleDialogClose}
                    caseId={caseId}
                />
            </BaseCaseDetailsCard>
        )
    }
}

export default IncidentDetails
