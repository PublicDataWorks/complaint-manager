import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import NavBar from "../../sharedComponents/NavBar";
import {connect} from "react-redux";
import Narrative from "./Narrative";
import CaseDetailSnackbar from "./CaseDetailSnackbar/CaseDetailSnackbar";
import ComplainantWitnesses from "./ComplainantWitnesses/ComplainantWitnesses";
import EditCivilianDialog from "./EditCivilianDialog/EditCivilianDialog"
import getCaseDetails from "../thunks/getCaseDetails";
import * as _ from 'lodash';
import Attachments from "./Attachments/Attachments";
import styles from "./caseDetailsStyles"
import CaseDrawer from "./CaseDrawer";

const drawerWidthPercentage = '30%';

const appBar = {
    position: 'absolute',
    marginLeft: drawerWidthPercentage,
    width: `calc(100% - ${drawerWidthPercentage})`,
}

class CaseDetails extends React.Component {
    state = {
        mobileOpen: false,
        caseHasBeenLoaded: false
    };

    caseHasBeenLoaded(caseIdAttemptingToRender) {
        return `${caseIdAttemptingToRender}` === this.props.match.params.id
    }

    componentWillMount() {
        this.setState({caseHasBeenLoaded: this.caseHasBeenLoaded(this.props.caseDetail.id)})
    }

    componentDidMount() {
        this.props.dispatch(getCaseDetails(this.props.match.params.id))
    }

    componentWillReceiveProps(nextProps) {
        this.setState({caseHasBeenLoaded: this.caseHasBeenLoaded(nextProps.caseDetail.id)})
    }

    render() {
        if (_.isEmpty(this.props.caseDetail) || !this.state.caseHasBeenLoaded) {
            return null
        }

        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <NavBar isHome={false} customStyle={appBar}>
                        <Typography
                            data-test="pageTitle"
                            type="title"
                            color="inherit"
                            style={{marginRight: '20px'}}

                        >
                            {`Case #${this.props.caseDetail.id}`}
                        </Typography>
                        <Typography
                            data-test="caseStatusBox"
                            type="caption"
                            color="inherit"
                            className={classes.statusBox}
                        >
                            {this.props.caseDetail.status}
                        </Typography>
                    </NavBar>
                    <CaseDrawer classes={classes} caseDetail={this.props.caseDetail}/>
                    <main className={classes.content}>
                        <ComplainantWitnesses caseDetail={this.props.caseDetail} dispatch={this.props.dispatch}/>
                        <Narrative
                            initialValues={{
                                narrativeDetails: this.props.caseDetail.narrativeDetails,
                                narrativeSummary: this.props.caseDetail.narrativeSummary
                            }}
                            caseId={this.props.caseDetail.id}
                        />
                        <Attachments />
                    </main>
                    <EditCivilianDialog/>
                    <CaseDetailSnackbar/>
                </div>
            </div>
        );
    }
}

CaseDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    caseDetail: state.currentCase
})

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(CaseDetails));