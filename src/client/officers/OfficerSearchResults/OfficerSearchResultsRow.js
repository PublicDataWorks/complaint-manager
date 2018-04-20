import React from 'react';
import tableStyleGenerator from "../../tableStyles";
import {TableCell, TableRow, withStyles} from "material-ui";
import LinkButton from "../../sharedComponents/LinkButton";
import { connect } from "react-redux";
import addOfficer from "../thunks/addOfficer";

const styles = theme => ({
    ...tableStyleGenerator(theme).body,
    buttonCell: {
        textAlign: 'right'
    },
});

const OfficerSearchResultsRow = ({ classes, officer, caseId, dispatch }) => (
    <TableRow className={classes.row}>
        <TableCell className={classes.cell}  style={{paddingLeft: '16px'}}>
            <div>{officer.fullName}</div>
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
            {officer.age}
        </TableCell>
        <TableCell className={classes.buttonCell}>
            <LinkButton
              onClick={() => {
                dispatch(addOfficer(caseId, officer.id))
              }}
            >
                select
            </LinkButton>
        </TableCell>
    </TableRow>
)

const mapStateToProps = (state) => ({
  caseId: state.currentCase.details.id
});

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(OfficerSearchResultsRow))