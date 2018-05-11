import React from 'react'
import getFirstComplainant from "../../utilities/getFirstComplainant";
import formatCivilianName from "../../utilities/formatCivilianName";
import WarningMessage from "../../sharedComponents/WarningMessage";
import {withStyles} from "material-ui";

const styles = {
    messageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '16px'
    }
}

const DisplayComplainant = ({ caseDetails, classes }) => {

    const { complainantWitnessOfficers = [], civilians = [] } = caseDetails

    const civilianComplainant = getFirstComplainant(civilians)
    const officerComplainant = getFirstComplainant(complainantWitnessOfficers)

    let formattedComplainant

    if (Boolean(civilianComplainant)) {
        formattedComplainant = formatCivilianName(civilianComplainant)
    } else if (Boolean(officerComplainant)) {
        formattedComplainant = officerComplainant.officer.fullName
    } else {
        formattedComplainant = ""
    }

    return (
        formattedComplainant
            ? <div>{formattedComplainant}</div>
            : (
                <div className={classes.messageContainer}>
                    <WarningMessage>
                        No Complainants
                    </WarningMessage>
                </div>
            )
    )
}

export default withStyles(styles)(DisplayComplainant)