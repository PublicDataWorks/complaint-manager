import React from 'react'
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import {connect} from "react-redux"
import getCases from "./thunks/getCases"

class CasesTable extends React.Component {

    componentWillMount = () => {
        this.props.getCases()
    }

    render() {
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
                    <TableBody>
                        {this.props.cases.map(entry => (
                            <TableRow key={entry.id} data-test={`caseRow${entry.id}`}>
                                <TableCell data-test="caseNumber">
                                    {entry.id}
                                </TableCell>
                                <TableCell data-test="caseStatus">
                                    {entry.status}
                                    </TableCell>
                                <TableCell data-test="caseName">
                                    {`${entry.lastName}, ${entry.firstName[0]}.`}
                                </TableCell>
                                <TableCell data-test="caseCreatedAt">
                                    {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>)
    }
}

const mapStateToProps = state => ({
    cases: state.cases.all
})

const mapDispatchToProps = {
    getCases
}

export default connect(mapStateToProps, mapDispatchToProps)(CasesTable)