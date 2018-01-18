import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import NavBar from "../../sharedComponents/NavBar";
import {Link} from "react-router-dom";
import LinkButton from "../../sharedComponents/LinkButton";
import {connect} from "react-redux";
import {Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";
import formatName from "../../formatName";
import formatDate from "../../formatDate";

const drawerWidthPercentage = '30%';

const appBar = {
    position: 'absolute',
    marginLeft: drawerWidthPercentage,
    width: `calc(100% - ${drawerWidthPercentage})`,
}


const styles = theme => ({
    root: {
        width: '100%',
        height: 430,
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
    statusBox:{
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

        const {classes, theme} = this.props;

        const drawer = (
            <div>
                <LinkButton component={Link} to={'/'} style={{ margin: '4% 0% 5% 2%'}}>Back to all Cases</LinkButton>
                <Typography data-test="case-number" type="title" style={{ marginLeft: "24px", marginTop: '4px'}} gutterBottom>
                    {`Case #${this.props.caseDetail.id}`}
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography type='body1'>Created On</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography type='body1'>Created By</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography type='body1'>Assigned To</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell data-test="created-on">
                                <Typography type='body1'>{formatDate(this.props.caseDetail.createdAt)}</Typography>
                            </TableCell>
                            <TableCell data-test="created-by">
                                <Typography type='body1'>Created by placeholder</Typography>
                            </TableCell>
                            <TableCell data-test="assigned-to">
                                <Typography type='body1'>Assigned to placeholder</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Divider/>

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
                            style={{marginRight:'20px'}}

                        >
                            {formatName(this.props.caseDetail.firstName, this.props.caseDetail.lastName)}
                        </Typography>
                        <Typography
                            data-test="caseStatusBox"
                            type="caption"
                            color="inherit"
                            className={classes.statusBox}
                        >
                            { this.props.caseDetail.status }
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
                        Content placeholder
                    </main>
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