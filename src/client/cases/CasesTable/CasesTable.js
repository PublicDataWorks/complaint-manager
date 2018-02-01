import React from 'react'
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import {connect} from "react-redux"
import CaseRow from './CaseRow'
import {Paper, TableSortLabel, withStyles} from "material-ui";
import tableStyleGenerator from '../../tableStyles'
import _ from 'lodash'
import {updateSort} from "../actionCreators";

const numberOfColumns = 5;

const styles = theme => ({
    ...(tableStyleGenerator(numberOfColumns, theme).header),
    ...(tableStyleGenerator(numberOfColumns, theme).table)
})

class CasesTable extends React.Component {
    render() {
        const {classes} = this.props
        return (
            <div>
                <Typography
                    type="title"
                    className={classes.labelMargin}>
                    Results
                </Typography>
                <Paper elevation={0} className={classes.tableMargin}>
                    <Table data-test='allCasesTable'>
                        <TableHead>
                            <TableRow className={classes.row}>
                                <TableCell data-test='casesNumberHeader' className={classes.cell}>
                                    <TableSortLabel
                                        data-test='caseNumberSortLabel'
                                        onClick={() => this.props.dispatch(updateSort('id'))}
                                        direction={this.props.sortDirection}
                                        active={this.props.sortBy === 'id'}
                                    >
                                        <Typography type='body2'>Case #</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell data-test='casesStatusHeader' className={classes.cell}>
                                    <TableSortLabel
                                        data-test='statusSortLabel'
                                        onClick={() => this.props.dispatch(updateSort('status'))}
                                        direction={this.props.sortDirection}
                                        active={this.props.sortBy === 'status'}
                                    >
                                    <Typography type='body2'>Status</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell data-test='casesComplainantHeader' className={classes.cell}>
                                    <Typography type='body2'>Complainant</Typography>
                                </TableCell>
                                <TableCell data-test='casesFirstContactDateHeader' className={classes.cell}>
                                    <Typography type='body2'>First Contact Date</Typography>
                                </TableCell>
                                <TableCell className={classes.cell}>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                _.orderBy(this.props.cases, [this.props.sortBy], [this.props.sortDirection])
                                    .map(caseDetails => <CaseRow key={caseDetails.id} caseDetails={caseDetails}/>)
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>)
    }
}

const mapStateToProps = state => ({
    cases: state.cases.all,
    caseCreationSuccess: state.cases.creation.success,
    sortBy: state.ui.casesTable.sortBy,
    sortDirection: state.ui.casesTable.sortDirection,
})

const mapDispatchToProps = {
    updateSortBy: updateSort
}

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(CasesTable))
