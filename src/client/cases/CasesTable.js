import React from 'react'
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import {connect} from "react-redux"
import getCases from "./thunks/getCases"
import CaseRow from './CaseRow'


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
                            <TableCell data-test='casesNumberHeader'>
                              <Typography type='body2'>Case #</Typography>
                            </TableCell>
                            <TableCell data-test='casesStatusHeader'>
                              <Typography type='body2'>Status</Typography>
                            </TableCell>
                            <TableCell data-test='casesComplainantHeader'>
                              <Typography type='body2'>Complainant</Typography>
                            </TableCell>
                            <TableCell data-test='casesCreatedOnHeader'>
                              <Typography type='body2'>Created On</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.cases.map(caseDetails => (
                           <CaseRow key={caseDetails.id} caseDetails={caseDetails}/>
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
