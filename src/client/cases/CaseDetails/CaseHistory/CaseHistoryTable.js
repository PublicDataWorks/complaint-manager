import React, {Component} from 'react';
import {Paper, Table, TableBody, TableCell, TableRow, Typography, withStyles} from "material-ui";
import tableStyleGenerator from "../../../tableStyles";
import CaseHistoryTableHeader from "./CaseHistoryTableHeader";

const styles = theme => ({
    ...(tableStyleGenerator(theme).table),
    ...(tableStyleGenerator(theme).body)
});

class CaseHistoryTable extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div>
                <Typography
                    variant="title"
                    className={classes.labelMargin}>
                    Case History
                </Typography>
                <Typography
                    variant="body1"
                    className={classes.labelMargin}
                >
                    Below you will find the full case history, including all automatically captured actions since the case's creation.
                </Typography>
                <Paper elevation={0} className={classes.tableMargin}>
                    <Table>
                        <CaseHistoryTableHeader/>
                        <TableBody>
                            <TableRow className={classes.row}>
                                <TableCell className={classes.cell}>
                                    someone
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    something
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    details
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    now
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>

            </div>
        )
    }

}

export default withStyles(styles, {withTheme: true})(CaseHistoryTable);