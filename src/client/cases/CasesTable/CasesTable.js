import React from 'react'
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import {connect} from "react-redux"
import CaseRow from './CaseRow'
import {Paper, withStyles} from "material-ui";
import tableStyleGenerator from '../../tableStyles'
import _ from 'lodash'

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
                                <TableCell data-test='casesNumberHeader' className={classes.cell}>
                                    <Typography type='body2'>Case #</Typography>
                                </TableCell>
                                <TableCell data-test='casesComplainantTypeHeader' className={classes.cell}>
                                    <Typography type='body2'>Complainant Type</Typography>
                                </TableCell>
                                <TableCell data-test='casesStatusHeader' className={classes.cell}>
                                    <Typography type='body2'>Status</Typography>
                                </TableCell>
                                <TableCell data-test='casesComplainantHeader' className={classes.cell}>
                                    <Typography type='body2'>Complainant</Typography>
                                </TableCell>
                                <TableCell data-test='casesCreatedOnHeader' className={classes.cell}>
                                    <Typography type='body2'>Created On</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                _.sortBy(this.props.cases, 'id')
                                    .reverse()
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
    caseCreationSuccess: state.cases.creation.success
})

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(CasesTable))
