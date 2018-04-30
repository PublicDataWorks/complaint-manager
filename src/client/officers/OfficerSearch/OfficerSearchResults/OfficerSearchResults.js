import React, { Component } from 'react'
import { Paper, Table, TableBody, Typography } from "material-ui";
import { LinearProgress } from 'material-ui/Progress'
import {connect} from "react-redux";
import OfficerSearchResultsRow from "./OfficerSearchResultsRow";
import {searchOfficersCleared} from "../../../actionCreators/officersActionCreators";
import OfficerSearchTableHeader from "../../OfficerSearchTableHeader";
import {PreviouslyAddedOfficer, SelectNewOfficer} from "./officerSearchResultsRowButtons";

export class OfficerSearchResults extends Component {
    componentWillUnmount() {
        this.props.dispatch(searchOfficersCleared())
    }

    render() {
        return (
            <div>
                <Typography
                    type="title">
                    Search Results
                </Typography>
                <Paper elevation={0}>
                    { this.renderSearchResultsMessage() }
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

    renderSearchResultsMessage = () => {
        if (this.props.spinnerVisible) { return null }
        let message = ""
        if (this.props.searchResults.length === 0) {
            message = "No results found"
        } else if (this.props.searchResults.length === 1) {
            message = `1 result found`
        } else {
            message = `${this.props.searchResults.length} results found`
        }

        return (
            <Typography
                type="body1"
                data-test={"searchResultsMessage"}
                style={{marginBottom: '16px'}}
            >
                {message}
            </Typography>
        );
    };

    renderSearchResults = () => {
        if (this.props.searchResults.length === 0 ) { return null }
        return (
            <Table>
                <OfficerSearchTableHeader/>
                <TableBody>
                    {
                        this.generateResultsRows()
                    }
                </TableBody>
            </Table>
        )
    }

    generateResultsRows() {
        const { searchResults, officerIds, dispatch } = this.props

        return searchResults.map(officer =>
            <OfficerSearchResultsRow
                key={officer.id}
                officer={officer}
            >
                {officerIds.includes(officer.id) ?
                    <PreviouslyAddedOfficer/> :
                    <SelectNewOfficer
                        dispatch={dispatch}
                        officer={officer}
                    />
                }
            </OfficerSearchResultsRow>
        )
    }
}

const mapStateToProps = (state) => ({
    searchResults: state.officers.searchResults,
    spinnerVisible: state.officers.spinnerVisible,
    officerIds: state.currentCase.details.accusedOfficers.map(officer => officer.officerId)
});


export default (connect(mapStateToProps)(OfficerSearchResults));