import React from 'react'
import {TableCell, TableRow, withStyles} from 'material-ui'
import formatDate from "../../formatDate";
import {Link} from "react-router-dom";
import LinkButton from "../../sharedComponents/LinkButton";
import formatName from "../../formatName";
import tableStyleGenerator from "../../tableStyles";

const numberOfColumns = 6

const styles = theme => ({
    ...tableStyleGenerator(numberOfColumns, theme).body,
    buttonCell: {
        textAlign: 'right'
    },
})

const CaseRow = ({classes, caseDetails}) => (
    <TableRow data-test={`caseRow${caseDetails.id}`} className={classes.row}>
        <TableCell data-test="caseNumber" className={classes.cell}>
            {caseDetails.id}
        </TableCell>
        <TableCell data-test="complainantType" className={classes.cell}>
            {caseDetails.complainantType}
        </TableCell>
        <TableCell data-test="caseStatus" className={classes.cell}>
            {caseDetails.status}
        </TableCell>
        <TableCell data-test="caseName" className={classes.cell}>
            {formatName(caseDetails.firstName, caseDetails.lastName)}
        </TableCell>
        <TableCell data-test="caseCreatedAt" className={classes.cell}>
            {formatDate(caseDetails.createdAt)}
        </TableCell>
        <TableCell data-test="openCase" className={classes.buttonCell}>
            <LinkButton component={Link} to={`/case/${caseDetails.id}`} data-test="openCaseButton">Open
                Case</LinkButton>
        </TableCell>
    </TableRow>
)


export default withStyles(styles, {withTheme: true})(CaseRow)