import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import NavBar from "../../sharedComponents/NavBar/NavBar";
import {connect} from "react-redux";
import Narrative from "./Narrative";
import CaseDetailSnackbar from "./CaseDetailSnackbar/CaseDetailSnackbar";
import ComplainantWitnesses from "./ComplainantWitnesses/ComplainantWitnesses";
import CivilianDialog from "./CivilianDialog/CivilianDialog"
import getCaseDetails from "../thunks/getCaseDetails";
import * as _ from 'lodash';
import Attachments from "./Attachments/Attachments";
import styles from "./caseDetailsStyles"
import CaseDrawer from "./CaseDrawer";
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { Menu, MenuItem } from "material-ui";
import IncidentDetailsContainer from "./IncidentDetails/IncidentDetailsContainer";
import {openCivilianDialog} from "../../actionCreators/casesActionCreators";
import createCivilian from "../thunks/createCivilian";
import {CIVILIAN_FORM_NAME} from "../../../sharedUtilities/constants";
import {initialize} from "redux-form";
import {push} from 'react-router-redux'
import Officers from "./Officers/Officers";


const drawerWidthPercentage = '30%';

const appBar = {
    position: 'absolute',
    marginLeft: drawerWidthPercentage,
    width: `calc(100% - ${drawerWidthPercentage})`,
}

class CaseDetails extends React.Component {
    state = {
        mobileOpen: false,
        menuOpen: false,
        anchorEl: null
    };

    handleMenuOpen = (event) => {
        this.setState({ menuOpen: true, anchorEl: event.currentTarget })
    }

    handleMenuClose = () => {
        this.setState({ menuOpen: false })
    }

    componentDidMount() {
        this.props.dispatch(getCaseDetails(this.props.match.params.id))
    }

    caseDetailsNotYetLoaded() {
        return _.isEmpty(this.props.caseDetail) || `${this.props.caseDetail.id}` !== this.props.match.params.id;
    }

    render() {
        if (this.caseDetailsNotYetLoaded()) { return null }

        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <NavBar isHome={false} customStyle={appBar}>
                        <Typography
                            data-test="pageTitle"
                            type="title"
                            color="inherit"
                            style={{ marginRight: '20px' }}

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
                        <IncidentDetailsContainer/>
                        <ComplainantWitnesses caseDetail={this.props.caseDetail} dispatch={this.props.dispatch}/>
                        <Narrative
                            initialValues={{
                                narrativeDetails: this.props.caseDetail.narrativeDetails,
                                narrativeSummary: this.props.caseDetail.narrativeSummary
                            }}
                            caseId={this.props.caseDetail.id}
                        />
                        <Officers caseDetail={this.props.caseDetail} />
                        <Attachments />
                    </main>
                    <CivilianDialog/>
                    <CaseDetailSnackbar/>
                    <Button
                        data-test="caseActionMenu"
                        fab
                        color="primary"
                        style={{ position: 'fixed', bottom: '32px', right: '32px' }}
                        onClick={this.handleMenuOpen}
                    >
                        <AddIcon/>
                    </Button>
                    <Menu
                        open={this.state.menuOpen}
                        onClose={this.handleMenuClose}
                        anchorEl={this.state.anchorEl}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem
                            data-test="addCivilianButton"
                            onClick={() => {
                                this.handleMenuClose()
                                this.props.dispatch(initialize(CIVILIAN_FORM_NAME, {roleOnCase: 'Complainant', caseId: this.props.caseDetail.id}))
                                this.props.dispatch(openCivilianDialog('Add Civilian', 'Create', createCivilian))
                            }}
                        >
                            Add Civilian
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                this.props.dispatch(push(`/cases/${this.props.caseDetail.id}/officers/search`))
                            }}
                        >
                           Add Officer
                        </MenuItem>
                    </Menu>
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
    caseDetail: state.currentCase.details
})

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(CaseDetails));