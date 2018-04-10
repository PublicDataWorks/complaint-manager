import React from 'react'
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import { CardContent } from "material-ui";
import CivilianInfoDisplay from "../ComplainantWitnesses/CivilianInfoDisplay";
import formatDate, {computeTimeZone, format12HourTime} from "../../../utilities/formatDate";
import LinkButton from "../../../sharedComponents/LinkButton";
import IncidentDetailsDialog from "./IncidentDetailsDialog";

class IncidentDetails extends React.Component {

    state = {
        dialogOpen: false
    }

    formatTimeForDisplay = (date, time) => {
        if (!time) return time
        return format12HourTime(time) + " " + computeTimeZone(date, time)
    }

    handleDialogOpen = () => {
        this.setState({ dialogOpen: true })
    }

    handleDialogClose = () => {
        this.setState({ dialogOpen: false })
    }

    render() {
        const {firstContactDate, incidentDate, incidentTime, caseId} = this.props

        return (
            <BaseCaseDetailsCard
                title='Incident Details'
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
                            value={this.formatTimeForDisplay(incidentDate, incidentTime)}
                            testLabel="incidentTime"
                        />
                        <LinkButton
                            data-test="editIncidentDetailsButton"
                            onClick={this.handleDialogOpen}
                        >
                            Edit
                        </LinkButton>
                    </div>
                </CardContent>
                <IncidentDetailsDialog
                    initialValues={{
                        firstContactDate,
                        incidentDate,
                        incidentTime
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
