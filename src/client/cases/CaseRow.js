import React from 'react'
import { TableCell, TableRow } from 'material-ui'

const styles = {
  row: {
    backgroundColor: 'white',
  }
}

const CaseRow = ({caseDetails}) => (
    <TableRow data-test={`caseRow${caseDetails.id}`} style={styles.row}>
        <TableCell data-test="caseNumber">
            {caseDetails.id}
        </TableCell>
        <TableCell data-test="caseStatus">
            {caseDetails.status}
        </TableCell>
        <TableCell data-test="caseName">
            {formatName(caseDetails.firstName, caseDetails.lastName)}
        </TableCell>
        <TableCell data-test="caseCreatedAt">
            {formatDate(caseDetails.createdAt)}
        </TableCell>
    </TableRow>
)

const formatName = (firstName, lastName) => `${lastName}, ${firstName[0]}.`

const formatDate = dateString => {
    const date = new Date(dateString)

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export default CaseRow