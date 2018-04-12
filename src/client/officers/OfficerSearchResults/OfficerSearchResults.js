import React, { Component } from 'react'
import tableStyleGenerator from "../../tableStyles";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles } from "material-ui";
import { LinearProgress } from 'material-ui/Progress'
import {connect} from "react-redux";
import OfficerSearchResultsRow from "./OfficerSearchResultsRow";

const numberOfColumns = 9;

const styles = theme => ({
    ...(tableStyleGenerator(numberOfColumns, theme).header),
    ...(tableStyleGenerator(numberOfColumns, theme).table)
})

export class OfficerSearchResults extends Component {
    render() {
        return (
            <div>
                <Typography
                    type="title">
                    Search Results
                </Typography>
                <Paper elevation={0}>
                    { this.renderNoSearchResults() }
                    { this.renderSearchResults() }
                    { this.renderSpinner() }
                </Paper>
            </div>)
    }

    renderSpinner = () => {
        if (!this.props.spinnerVisible) { return null }
        return (
            <div style={{textAlign: 'center'}}>
                <LinearProgress data-test="spinner" style={{marginTop: '24px'}} size={300}/>
            </div>
        );
    };

    renderNoSearchResults = () => {
        if (!this.props.spinnerVisible && this.props.searchResults.length === 0) {
            return <Typography type="body1" data-test={"noSearchResultsMessage"}>No results to show</Typography>;
        }
    };

    renderSearchResults = () => {
        if (this.props.searchResults.length === 0 ) { return null }
        const {classes} = this.props;
        return (
            <Table data-test='allCasesTable'>
                <TableHead>
                    <TableRow className={classes.row}>
                        <TableCell data-test='casesNumberHeader' className={classes.cell}>
                            <Typography type='body2'>Name (status)</Typography>
                        </TableCell>
                        <TableCell data-test='casesComplainantHeader' className={classes.cell}>
                            <Typography type='body2'>Rank</Typography>
                        </TableCell>
                        <TableCell data-test='casesFirstContactDateHeader' className={classes.cell}>
                            <Typography type='body2'>Bureau</Typography>
                        </TableCell>
                        <TableCell data-test='casesAssignedToHeader' className={classes.cell}>
                            <Typography type='body2'>District</Typography>
                        </TableCell>
                        <TableCell data-test='casesAssignedToHeader' className={classes.cell}>
                            <Typography type='body2'>Gender</Typography>
                        </TableCell>
                        <TableCell data-test='casesAssignedToHeader' className={classes.cell}>
                            <Typography type='body2'>Race</Typography>
                        </TableCell>
                        <TableCell data-test='casesAssignedToHeader' className={classes.cell}>
                            <Typography type='body2'>Age</Typography>
                        </TableCell>
                        <TableCell className={classes.cell}/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        this.props.searchResults.map(officer => <OfficerSearchResultsRow key={officer.id} officer={officer}/>)
                    }
                </TableBody>
            </Table>
        )
    }
}

const mapStateToProps = (state) => ({
    searchResults: state.officers.searchResults,
    spinnerVisible: state.officers.spinnerVisible
});


export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(OfficerSearchResults));