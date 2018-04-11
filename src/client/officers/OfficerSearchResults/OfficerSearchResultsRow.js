import React from 'react';
import tableStyleGenerator from "../../tableStyles";
import {TableCell, TableRow, withStyles} from "material-ui";
import moment from "moment";

const numberOfColumns = 9;

const styles = theme => ({
    ...tableStyleGenerator(numberOfColumns, theme).body,
    buttonCell: {
        textAlign: 'right'
    },
})

const OfficerSearchResultsRow = ({classes, officer}) => (
    <TableRow className={classes.row}>
        <TableCell className={classes.cell}>
            {officer.firstName} {officer.middleName} {officer.lastName}
        </TableCell>
        <TableCell className={classes.cell}>
            {officer.workStatus}
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
            {moment().diff(officer.dob, 'years', false)}
        </TableCell>
        <TableCell className={classes.cell}>

        </TableCell>
    </TableRow>
)


export default withStyles(styles, {withTheme: true})(OfficerSearchResultsRow)