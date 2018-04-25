import React, {Fragment} from 'react'
import ReportProblemIcon from '@material-ui/icons/ReportProblem'
import {withStyles} from "material-ui";

const styles = theme => ({
    warnIcon: {
        color: theme.palette.yellow,
        margin: "0 5px",
        height: 20,
        width: 20
    }
})

const WarningMessage = ({ classes, children }) => (
    <Fragment>
        <ReportProblemIcon data-test="warnIcon" className={classes.warnIcon}/>
        { children }
    </Fragment>
)

export default withStyles(styles, {withTheme: true})(WarningMessage)