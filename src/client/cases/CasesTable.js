import React from 'react'
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table'
import Typography from 'material-ui/Typography'

const CasesTable = (props) => {

    return (
        <div>
            <Typography type="title">Results</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell data-test='casesNumberHeader'>Case #</TableCell>
                        <TableCell data-test='casesStatusHeader'>Status</TableCell>
                        <TableCell data-test='casesComplainantHeader'>Complainant</TableCell>
                        <TableCell data-test='casesCreatedOnHeader'>Created On</TableCell>
                    </TableRow>
                </TableHead>
                {
                    (props.cases && props.cases.length > 0)
                        ? <TableBody>{
                            props.cases.map(entry =>
                                <TableRow key={entry.id} data-test="casesTableEntry">
                                    <TableCell>{entry.id}</TableCell>
                                    <TableCell>{entry.status} </TableCell>
                                    <TableCell>{`${entry.lastName}, ${entry.firstName[0]}.`}</TableCell>
                                    <TableCell>{(new Date(entry.createdAt)).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</TableCell>
                                </TableRow>)}
                        </TableBody>
                        : null
                }
            </Table>
        </div>)
}

export default CasesTable