import React from 'react'
import getFirstComplainant from "../../utilities/getFirstComplainant";
import formatName from "../../utilities/formatName";
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

const DisplayComplainant = ({ civilians, classes }) => {

    const complainant = getFirstComplainant(civilians)
    const hasComplainants = Boolean(complainant)

    return (
        hasComplainants
            ? <div>{formatName(complainant)}</div>
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