import React from 'react';
import tableStyleGenerator from "../../../tableStyles";
import {TableCell, TableRow, withStyles} from "material-ui";

const styles = theme => ({
    ...tableStyleGenerator(theme).body,
    buttonCell: {
        textAlign: 'right'
    },
    active: {
        color: theme.palette.green
    },
    terminated: {
        color: theme.palette.red
    },
    deceased: {
        color: theme.palette.secondary.main + '66' // 66 is 40% opacity in hex
    },
    retired: {
        color: theme.palette.secondary.main
    },
    inactive: {
        color: theme.palette.yellow
    }
});

const OfficerSearchResultsRow = ({classes, officer, children}) => (
    <TableRow className={classes.row}>
        <TableCell className={classes.cell} style={{paddingLeft: '16px'}}>
            <div>{officer.fullName}</div>
            <div className={classes[officer.workStatus.toLowerCase()]}>
                {officer.workStatus}
            </div>
        </TableCell>
        <TableCell className={classes.cell}>
            {officer.rank}
        </TableCell>
        <TableCell className={classes.cell}>
            {officer.bureau}
        </TableCell>
        <TableCell className={classes.cell}>
            {officer.district}
        </TableCell>
        <TableCell className={classes.cell}>
            {officer.gender}
        </TableCell>
        <TableCell className={classes.cell}>
            {officer.race}
        </TableCell>
        <TableCell className={classes.cell}>
            {officer.age}
        </TableCell>
        <TableCell className={classes.buttonCell}>
            {children}
        </TableCell>
    </TableRow>
)

export default withStyles(styles, {withTheme: true})(OfficerSearchResultsRow)