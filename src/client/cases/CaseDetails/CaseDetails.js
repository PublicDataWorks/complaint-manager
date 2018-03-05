import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography';
import NavBar from "../../sharedComponents/NavBar";
import {Link} from "react-router-dom";
import LinkButton from "../../sharedComponents/LinkButton";
import {connect} from "react-redux";
import formatName from "../../utilities/formatName";
import formatDate from "../../utilities/formatDate";
import Narrative from "./Narrative";
import CaseDetailSnackbar from "./CaseDetailSnackbar/CaseDetailSnackbar";
import ComplainantWitnesses from "./ComplainantWitnesses/ComplainantWitnesses";
import EditCivilianDialog from "./EditCivilianDialog/EditCivilianDialog"
import getPrimaryComplainant from "../../utilities/getPrimaryComplainant";
import getCaseDetails from "../thunks/getCaseDetails";
import * as _ from 'lodash';
import Attachments from "./Attachments/Attachments";

const drawerWidthPercentage = '30%';

const appBar = {
    position: 'absolute',
    marginLeft: drawerWidthPercentage,
    width: `calc(100% - ${drawerWidthPercentage})`,
}


const styles = theme => ({
    root: {
        width: '100%',
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute',
        marginLeft: drawerWidthPercentage,
        width: `calc(100% - ${drawerWidthPercentage})`,
    },

    drawerHeader: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidthPercentage,
        height: '100%',
        backgroundColor: 'white'
    },
    drawerRow: {
        marginLeft: '6%',
        display: "flex",
        marginBottom: '8px',
        flexWrap: 'wrap'
    },
    drawerRowItem: {
        flex: 1,
        textAlign: 'left',
        minWidth: "100px",
        marginRight: '8px',
        marginBottom: '8px'
    },
    content: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
        padding: theme.spacing.unit * 3,
        height: 'calc(100% - 56px)',
        marginTop: 56,
        marginLeft: drawerWidthPercentage,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 64,
        },
    },
    statusBox: {
        backgroundColor: theme.palette.green,
        padding: '6px 15px 4px 15px',
        borderRadius: '4px',
        margin: '0%'
    }
});

class CaseDetails extends React.Component {
    state = {
        mobileOpen: false,
    };

    componentWillMount() {
        this.props.dispatch(getCaseDetails(this.props.match.params.id))
    }

    render() {
        if (_.isEmpty(this.props.caseDetail)) {
            return null
        }

        const {classes} = this.props;

        const drawer = (
            <div>
                <LinkButton data-test="all-cases-link" component={Link} to={'/'} style={{margin: '4% 0% 5% 2%'}}>Back to all Cases</LinkButton>
                <Typography data-test="case-number" type="title" style={{marginLeft: "24px", marginTop: '4px'}}
                            gutterBottom>
                    {`Case #${this.props.caseDetail.id}`}
                </Typography>
                <div className={classes.drawerRow}>
                    <div className={classes.drawerRowItem}>
                        <Typography type='caption'>First Contact Date</Typography>
                        <Typography data-test="first-contact-date"
                                    type='body1'>{formatDate(this.props.caseDetail.firstContactDate)}</Typography>
                    </div>
                    <div className={classes.drawerRowItem}>
                        <Typography type='caption'>Created On</Typography>
                        <Typography data-test="created-on"
                                    type='body1'>{formatDate(this.props.caseDetail.createdAt)}</Typography>
                    </div>
                    <div className={classes.drawerRowItem}>
                        <Typography type='caption'>Complainant Type</Typography>
                        <Typography data-test="complainant-type"
                                    type='body1'>{this.props.caseDetail.complainantType}</Typography>
                    </div>
                </div>
                <div className={classes.drawerRow}>
                    <div className={classes.drawerRowItem}>
                        <Typography type='caption'>Created By</Typography>
                        <Typography data-test="created-by" type='body1'>{this.props.caseDetail.createdBy}</Typography>
                    </div>
                    <div className={classes.drawerRowItem}>
                        <Typography type='caption'>Assigned To</Typography>
                        <Typography data-test="assigned-to" type='body1'>{this.props.caseDetail.assignedTo}</Typography>
                    </div>
                    <div className={classes.drawerRowItem}>

                    </div>
                </div>
            </div>
        );

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
                            {formatName(getPrimaryComplainant(this.props.caseDetail.civilians))}
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
                    <Drawer
                        type="permanent"
                        anchor="left"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <main className={classes.content}>
                        <ComplainantWitnesses caseDetail={this.props.caseDetail} dispatch={this.props.dispatch}/>
                        <Narrative
                            initialValues={{narrative: this.props.caseDetail.narrative}}
                            caseId={this.props.caseDetail.id}
                        />
                        <Attachments caseDetail={this.props.caseDetail}/>
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