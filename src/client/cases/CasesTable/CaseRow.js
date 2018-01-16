import React from 'react'
import {TableCell, TableRow} from 'material-ui'
import formatDate from "../../formatDate";
import {Link} from "react-router-dom";
import LinkButton from "../../sharedComponents/LinkButton";
import themeStyles from "../../globalStyling/styles";

const styles = {
    row: {
        height: 80,
        backgroundColor: 'white',
        borderTop: `8px solid ${themeStyles.colors.secondary[50]}`,
        borderBottom: `8px solid ${themeStyles.colors.secondary[50]}`,
        width: '100%',
        overflowX: 'scroll'
    },
    cell: {
        padding: '0%',
        width: '16.5%',
        textAlign: 'center',
    },
    buttonCell: {
        padding: '2%',
        textAlign: 'right'
    },
}

const CaseRow = ({caseDetails}) => (
    <TableRow data-test={`caseRow${caseDetails.id}`} style={styles.row}>
        <TableCell data-test="caseNumber" style={styles.cell}>
            {caseDetails.id}
        </TableCell>
        <TableCell data-test="incidentType" style={styles.cell}>
            {caseDetails.incidentType}
        </TableCell>
        <TableCell data-test="caseStatus" style={styles.cell}>
            {caseDetails.status}
        </TableCell>
        <TableCell data-test="caseName" style={styles.cell}>
            {formatName(caseDetails.firstName, caseDetails.lastName)}
        </TableCell>
        <TableCell data-test="caseCreatedAt" style={styles.cell}>
            {formatDate(caseDetails.createdAt)}
        </TableCell>
        <TableCell data-test="openCase" style={styles.buttonCell}>
            <LinkButton component={Link} to={`/case/${caseDetails.id}`} data-test="openCaseButton">Open
                Case</LinkButton>
        </TableCell>
    </TableRow>
)

const formatName = (firstName, lastName) => `${lastName}, ${firstName[0]}.`

export default CaseRow