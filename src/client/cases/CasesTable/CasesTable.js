import React from 'react'
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import {connect} from "react-redux"
import CaseRow from './CaseRow'
import {Paper, TableSortLabel, withStyles} from "material-ui";
import tableStyleGenerator from '../../tableStyles'
import {updateSort} from "../actionCreators";
import sortBy from "../../utilities/sortBy";

const numberOfColumns = 6;

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
                                <TableCell data-test='casesNumberHeader' style={{paddingLeft:'24px'}} className={classes.cell}>
                                    <TableSortLabel
                                        data-test='caseNumberSortLabel'
                                        onClick={() => this.props.dispatch(updateSort('id'))}
                                        direction={this.props.sortDirection}
                                        active={this.props.sortBy === 'id'}
                                    >
                                        <Typography type='body2'>Case #</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell data-test='casesStatusHeader' style={{paddingLeft:'24px'}} className={classes.cell}>
                                    <TableSortLabel
                                        data-test='statusSortLabel'
                                        onClick={() => this.props.dispatch(updateSort('status'))}
                                        direction={this.props.sortDirection}
                                        active={this.props.sortBy === 'status'}
                                    >
                                        <Typography type='body2'>Status</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell data-test='casesComplainantHeader' style={{paddingLeft:'24px'}} className={classes.cell}>
                                    <TableSortLabel
                                        data-test='complainantSortLabel'
                                        onClick={() => this.props.dispatch(updateSort('lastName'))}
                                        direction={this.props.sortDirection}
                                        active={this.props.sortBy === 'lastName'}
                                    >
                                        <Typography type='body2'>Complainant</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell data-test='casesFirstContactDateHeader' style={{paddingLeft:'24px'}} className={classes.cell}>
                                    <TableSortLabel
                                        data-test='firstContactDateSortLabel'
                                        onClick={() => this.props.dispatch(updateSort('firstContactDate'))}
                                        direction={this.props.sortDirection}
                                        active={this.props.sortBy === 'firstContactDate'}
                                    >
                                        <Typography type='body2'>First Contact Date</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell data-test='casesAssignedToHeader' style={{paddingLeft:'24px'}} className={classes.cell}>
                                    <TableSortLabel
                                        data-test='casesAssignedToSortLabel'
                                        onClick={() => this.props.dispatch(updateSort('assignedTo'))}
                                        direction={this.props.sortDirection}
                                        active={this.props.sortBy === 'assignedTo'}
                                    >
                                        <Typography type='body2'>Assigned To</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{paddingLeft:'24px'}} className={classes.cell}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                sortBy(this.props.cases, this.props.sortBy, this.props.sortDirection)
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
    caseCreationSuccess: state.ui.snackbar.success,
    sortBy: state.ui.casesTable.sortBy,
    sortDirection: state.ui.casesTable.sortDirection,
})

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(CasesTable))
