import React, {Component} from 'react'
import getCaseDetails from "../cases/thunks/getCaseDetails";
import {connect} from "react-redux";
import NavBar from "../sharedComponents/NavBar/NavBar";
import {Card, CardContent, Typography} from "material-ui";
import {Link} from "react-router-dom";
import LinkButton from "../sharedComponents/LinkButton";
import OfficersSnackbar from "./OfficersSnackBar/OfficersSnackbar";
import OfficerSearchForm from "./OfficerSearchForm/OfficerSearchForm";
import OfficerSearchResults from "./OfficerSearchResults/OfficerSearchResults";

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

        const { caseId } = this.props
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
                <LinkButton data-test="back-to-case-link" component={Link} to={`/cases/${caseId}`} style={{margin: '2% 0% 2% 5%'}}>
                    Back to Case
                </LinkButton>
                <div style={{margin: '0% 5%'}}>
                    <div style={{margin: '0 0 20px 0'}}>
                        <Typography type="title">Search for an Officer</Typography>
                        <Typography type="body1">Search by entering at least one of the following fields</Typography>
                    </div>

                    <Card
                        style=
                            {{
                                backgroundColor: 'white',
                                width: '100%',
                                margin: '0 0 32px 0'
                            }}
                    >
                        <CardContent style={{paddingBottom: '8px'}}>
                            <OfficerSearchForm caseId={this.props.caseId}/>
                        </CardContent>
                    </Card>
                    <OfficerSearchResults/>
                </div>

                <OfficersSnackbar/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    caseId: state.currentCase.id
});

export default connect(mapStateToProps)(OfficerDashboard);