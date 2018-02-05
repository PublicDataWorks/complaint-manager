import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography';
import NavBar from "../../sharedComponents/NavBar";
import {Link} from "react-router-dom";
import LinkButton from "../../sharedComponents/LinkButton";
import {connect} from "react-redux";
import formatName from "../../formatName";
import formatDate from "../../formatDate";
import Narrative from "./Narrative";
import CaseDetailSnackbar from "./CaseDetailSnackbar";
import ComplainantWitnesses from "./ComplainantWitnesses";
import EditCivilianDialog from "./EditCivilianDialog/EditCivilianDialog"

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

    render() {
        if (!this.props.caseDetail) {
            return null
        }

        const {classes} = this.props;

        const drawer = (
            <div>
                <LinkButton component={Link} to={'/'} style={{margin: '4% 0% 5% 2%'}}>Back to all Cases</LinkButton>
                <Typography data-test="case-number" type="title" style={{marginLeft: "24px", marginTop: '4px'}}
                            gutterBottom>
                    {`Case #${this.props.caseDetail.id}`}
                </Typography>
                <div style={{marginLeft: '6%', display: "flex", marginBottom: '16px'}}>
                    <div style={{flex: 1, textAlign: 'left'}}>
                        <Typography type='caption'>First Contact Date</Typography>
                        <Typography data-test="first-contact-date"
                                    type='body1'>{formatDate(this.props.caseDetail.firstContactDate)}</Typography>
                    </div>
                    <div style={{flex: 1, textAlign: 'left'}}>
                        <Typography type='caption'>Created On</Typography>
                        <Typography data-test="created-on"
                                    type='body1'>{formatDate(this.props.caseDetail.createdAt)}</Typography>
                    </div>
                    <div style={{flex: 1, textAlign: 'left'}}>
                        <Typography type='caption'>Complainant Type</Typography>
                        <Typography data-test="complaint-type"
                                    type='body1'>{this.props.caseDetail.complainantType}</Typography>
                    </div>
                </div>
                <div style={{marginLeft: '6%', display: "flex"}}>
                    <div style={{flex: 1, textAlign: 'left'}}>
                        <Typography type='caption'>Created By</Typography>
                        <Typography data-test="created-by" type='body1'>not added</Typography>
                    </div>
                    <div style={{flex: 1, textAlign: 'left'}}>
                        <Typography type='caption'>Assigned To</Typography>
                        <Typography data-test="assigned-to" type='body1'>not added</Typography>
                    </div>
                    <div style={{flex: 1, textAlign: 'left'}}>

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
                            {formatName(this.props.caseDetail.firstName, this.props.caseDetail.lastName)}
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

const mapStateToProps = (state, ownProps) => ({
    caseDetail: state.cases.all.find((caseDetail) => caseDetail.id.toString() === ownProps.match.params.id)
})

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(CaseDetails));