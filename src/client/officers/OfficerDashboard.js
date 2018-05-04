import React, {Component} from 'react'
import getCaseDetails from "../cases/thunks/getCaseDetails";
import {connect} from "react-redux";
import NavBar from "../sharedComponents/NavBar/NavBar";
import {Typography} from "material-ui";
import {Link} from "react-router-dom";
import LinkButton from "../sharedComponents/LinkButton";
import OfficersSnackbar from "./OfficersSnackBar/OfficersSnackbar";
import OfficerSearch from "./OfficerSearch/OfficerSearch";
import OfficerDetails from "./OfficerDetails/OfficerDetails";
import {clearSelectedOfficer} from "../actionCreators/officersActionCreators";
import {
    SelectUnknownOfficer
} from "./OfficerSearch/OfficerSearchResults/officerSearchResultsRowButtons";

export class OfficerDashboard extends Component {
    componentDidMount() {
        if (`${this.props.caseId}` !== this.props.match.params.id) {
            this.props.dispatch(getCaseDetails(this.props.match.params.id))
        }
    }

    render() {
        const {caseId, selectedOfficerData, officerCurrentlySelected, match} = this.props;
        if (`${caseId}` !== match.params.id) {
            return null
        }

        return (
            <div>
                <NavBar>
                    <Typography
                        data-test="pageTitle"
                        variant="title"
                        color="inherit"
                    >
                        {`Case #${caseId}   : Add Officer`}
                    </Typography>
                </NavBar>
                <LinkButton
                    data-test="back-to-case-link"
                    component={Link}
                    to={`/cases/${caseId}`}
                    style={{margin: '2% 0% 2% 4%'}}
                    onClick={() => this.props.dispatch(clearSelectedOfficer())}
                >
                    Back to Case
                </LinkButton>
                <div style={{margin: '0% 5% 3%'}}>
                    {
                        officerCurrentlySelected ? (
                            <OfficerDetails
                                selectedOfficerData={selectedOfficerData}
                                caseId={caseId}
                            />
                        ) : (
                            <div>
                                <OfficerSearch dispatch={this.props.dispatch} caseId={caseId}/>
                                <SelectUnknownOfficer dispatch={this.props.dispatch}/>
                            </div>
                        )
                    }
                </div>
                <OfficersSnackbar/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    caseId: state.currentCase.details.id,
    selectedOfficerData: state.officers.selectedOfficerData,
    officerCurrentlySelected: state.officers.officerCurrentlySelected
});

export default connect(mapStateToProps)(OfficerDashboard);