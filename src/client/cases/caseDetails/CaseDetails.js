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

const drawerWidth = 240;

const appBar = {
    position: 'absolute',
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    overflowX: 'scroll'
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
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        overflowX: 'scroll'
    },

    drawerHeader: theme.mixins.toolbar,
    drawerPaper: {
        width: 250,
        height: '100%',
        backgroundColor: 'white'
    },
    content: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
        padding: theme.spacing.unit * 3,
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 64,
        },
    },
    statusBox:{
        backgroundColor: theme.palette.green,
        padding: '3px 15px',
        borderRadius: '4px',
        margin: '2%'
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

        const {classes } = this.props;

        const drawer = (
            <div>
                <LinkButton component={Link} to={'/'}>Back to all Cases</LinkButton>
                <Divider/>
                <h3 data-test="case-number">{`Case #${this.props.caseDetail.id}`}</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography type='body'>Created On</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography type='body'>Created By</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography type='body'>Assigned To</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell data-test="created-on">
                                <Typography type='body'>{formatDate(this.props.caseDetail.createdAt)}</Typography>
                            </TableCell>
                            <TableCell data-test="created-by">
                                <Typography type='body'>Chris Kozak</Typography>
                            </TableCell>
                            <TableCell data-test="assigned-to">
                                <Typography type='body'>Monica Shum</Typography>
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
                            data-test="pageTitle"
                            type="title"
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
                        <Typography noWrap>{'Blah Blah Blah'}</Typography>
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

//TODO: Nav bar shows status in green box
//TODO: Switch to Permanent Drawer
//TODO: Wire up created-on, created-by, and assigned-to