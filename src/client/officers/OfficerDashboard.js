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

export class OfficerDashboard extends Component {
    componentDidMount() {
        if (`${this.props.caseId}` !== this.props.match.params.id) {
            this.props.dispatch(getCaseDetails(this.props.match.params.id))
        }
    }

    render() {
        if (`${this.props.caseId}` !== this.props.match.params.id) {
            return null
        }

        const {caseId} = this.props
        return (
            <div>
                <NavBar>
                    <Typography
                        data-test="pageTitle"
                        type="title"
                        color="inherit"
                    >
                        {`Case #${caseId} : Add Officer`}
                    </Typography>
                </NavBar>
                <LinkButton data-test="back-to-case-link" component={Link} to={`/cases/${caseId}`}
                            style={{margin: '2% 0% 2% 4%'}}>
                    Back to Case
                </LinkButton>
                <div style={{margin: '0% 5% 3%'}}>
                    { this.props.selectedOfficer ? <OfficerDetails officer={this.props.selectedOfficer}/> : <OfficerSearch caseId={caseId}/>}
                </div>

                <OfficersSnackbar/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    caseId: state.currentCase.details.id,
    selectedOfficer: state.officers.selectedOfficer
});

export default connect(mapStateToProps)(OfficerDashboard);